import pandas as pd
import os
import re
import unicodedata
from input_loader import load_from_csv

# =====================================================
# LOAD DATA (FIXED FOR SAFETY)
# =====================================================
csv_path = "sms_raw.csv"

def get_initial_data():
    if os.path.exists(csv_path):
        try:
            return load_from_csv(csv_path)
        except Exception as e:
            print(f"Error reading CSV: {e}")
            return pd.DataFrame()
    else:
        return pd.DataFrame()

# This is the ONLY place we initialize df
df = get_initial_data()

# =====================================================
# TEXT NORMALIZATION
# =====================================================
def normalize_text(text):
    if pd.isna(text):
        return ""
    text = unicodedata.normalize("NFKD", str(text))
    text = text.encode("ascii", "ignore").decode("ascii")
    return text.lower().strip()

# Apply normalization safely only if df is not empty
if not df.empty:
    df["text"] = df["text"].apply(normalize_text)

# =====================================================
# REGEX PATTERNS
# =====================================================
AMOUNT_REGEX = re.compile(r"(?:rs\.?|inr|₹)\s?\d+(?:,\d{3})*(?:\.\d+)?", re.I)
OTP_REGEX = re.compile(r"\b(otp|one time password|verification code|login code)\b")

PROMO_REGEX = re.compile(
    r"(offer|discount|subscribe|download app|apply now|approved)",
    re.I
)

TRANSACTION_KEYWORDS = [
    "debited", "credited", "spent", "paid",
    "charged", "received", "withdrawn", "purchase"
]

HARD_IGNORE = [
    "quota", "data usage", "sms usage",
    "credit limit", "reward", "bonus",
    "promotion", "scholarship"
]

ACCOUNT_REGEX = re.compile(r"\b\d{4,}\b")
PHONE_REGEX = re.compile(r"\b\d{10}\b")
UPI_REGEX = re.compile(r"\b[\w\.-]+@[\w\.-]+\b")

# =====================================================
# FILTERING
# =====================================================
def is_transaction(text):
    return bool(AMOUNT_REGEX.search(text)) and any(k in text for k in TRANSACTION_KEYWORDS)

def is_noise(text):

    if OTP_REGEX.search(text):
        return True

    PROMO_HARD = [
        "get flat", "off on", "happy hours",
        "visit http", "call us at",
        "redeem now", "assured cashback"
    ]

    LOAN_NOISE = [
        "loan application",
        "if you didn't apply",
        "true balance",
        "true credits"
    ]

    if PROMO_REGEX.search(text):
        return True

    if any(p in text for p in PROMO_HARD):
        return True

    if any(k in text for k in LOAN_NOISE):
        return True

    if any(word in text for word in HARD_IGNORE):
        return True

    return False


# =====================================================
# EXTRACTION FUNCTIONS
# =====================================================
def extract_amount(text):
    match = AMOUNT_REGEX.search(text)
    if not match:
        return None

    amt = match.group()

    # Poisoned amounts like rs.<ACC>.00
    if "<acc>" in amt.lower():
        return None

    amt = (
        amt.lower()
        .replace("rs.", "")
        .replace("rs", "")
        .replace("inr", "")
        .replace("₹", "")
        .replace(",", "")
    )

    try:
        return float(amt)
    except ValueError:
        return None


def extract_direction(text):
    if "credited" in text or "received" in text:
        return "credit"
    return "debit"

def extract_payment_type(text):
    text = text.lower()

    if "upi" in text:
        return "UPI"
    if any(k in text for k in ["debit card", "credit card", "pos", "card swipe"]):
        return "CARD"
    if "atm" in text or "withdrawn" in text:
        return "ATM"
    if any(k in text for k in ["neft", "imps", "rtgs"]):
        return "BANK_TRANSFER"
    if "wallet" in text:
        return "WALLET"

    return "OTHER"


def is_self_transfer(text):
    return (
        "debited" in text and
        "credited" in text and
        any(k in text for k in [
            "upi", "imps", "neft", "rtgs",
            "own account", "self"
        ])
    )



def classify_txn_type(text, direction):
    text = text.lower()

    # -------------------------------
    # 0️⃣ Hard blockers (non-financial noise)
    # -------------------------------
    if any(k in text for k in [
        "otp", "verification code", "login code",
        "offer valid", "download app", "apply now"
    ]):
        return "ignore"

    if "atm" in text and "withdrawn" in text:
        return "cash_withdrawal"

    # -------------------------------
    # 1️⃣ Refunds & reversals (highest priority)
    # -------------------------------
    if any(k in text for k in [
        "refund", "reversal", "reversed",
        "chargeback", "txn reversed", "money returned"
    ]):
        return "refund"

    # -------------------------------
    # 2️⃣ Rewards / incentives / winnings
    # (Only promotional money, NOT real income)
    # -------------------------------
    REWARD_KEYWORDS = [
        "cashback", "reward", "bonus", "promo",
        "added just for you", "wallet credit",
        "win", "winnings", "spinwheel",
        "tournament", "league", "jackpot",
        "play cash games", "game credit"
    ]

    NON_REWARD_BLOCKERS = [
        "loan", "emi", "pay later", "bnpl",
        "repayment", "due", "outstanding",
        "salary", "deposit", "refund"
    ]

    if (
        direction == "credit" and
        any(k in text for k in REWARD_KEYWORDS) and
        not any(b in text for b in NON_REWARD_BLOCKERS)
    ):
        return "reward"

    # -------------------------------
    # 3️⃣ Fees, penalties & charges
    # -------------------------------
    if any(k in text for k in [
        "fee", "penalty", "late charge",
        "overdue", "service charge",
        "interest", "annual charge",
        "cancellation fee"
    ]):
        return "fee"

    # -------------------------------
    # 4️⃣ Credit-side classification
    # -------------------------------
    if direction == "credit":

        # Genuine income
        if any(k in text for k in [
            "salary",
            "credited as salary",
            "payroll",
            "deposit of cash",
            "cash deposit",
            "stipend",
            "freelance payment",
            "commission",
            "neft", "imps", "rtgs"
        ]):
            return "income"

        # Everything else credited = transfer
        # (UPI self-transfer, wallet load, settlement, payout)
        return "transfer"

    # -------------------------------
    # 5️⃣ Debit-side logic
    # -------------------------------
    if direction == "debit":

        # BNPL / EMI repayments
        if any(k in text for k in [
            "emi", "loan repayment", "pay later",
            "bnpl", "due amount"
        ]):
            return "transfer"

        # All remaining debits
        return "expense"

    return "expense"



def extract_merchant(text, sender, direction):
    if direction != "debit":
        return "bank_transfer"
    
    # NEVER infer merchant from credits
    if direction == "credit":
        return "bank_transfer"

    sender = str(sender).lower()

    BRAND_LIST = [
    # Food & Grocery
    "zomato","swiggy","blinkit","zepto","bigbasket","dunzo",
    "dominos","pizza hut","kfc","mcdonalds","burger king","subway",
    "starbucks","chai point","eatsure","freshmenu",

    # Shopping
    "amazon","flipkart","meesho","myntra","ajio","nykaa",
    "tatacliq","snapdeal","shopclues","firstcry","pepperfry","urban ladder",

    # Transport
    "uber","ola","rapido","yulu","blusmart","indrive","bounce",

    # Payments & Wallets
    "paytm","phonepe","google pay","gpay","amazon pay","mobikwik",
    "freecharge","simpl","lazypay","postpe","slice","cred","bharatpe",

    # Banks
    "sbi","hdfc","icici","axis","kotak","indusind","yes bank",
    "pnb","bob","canara","union bank","idfc","bandhan","au bank",

    # Telecom
    "jio","airtel","vi","vodafone","idea","bsnl","jiofiber","act fibernet",

    # Utilities
    "bescom","tangedco","bseb","mseb","adani gas","indraprastha gas",
    "hp gas","bharat gas","indane","electricity","water bill",

    # OTT
    "netflix","amazon prime","hotstar","disney","sonyliv","zee5",
    "voot","spotify","youtube premium","gaana","jiosaavn","apple music",

    # Travel
    "irctc","makemytrip","goibibo","cleartrip","yatra","ixigo",
    "oyo","booking.com","agoda","airbnb","redbus",

    # Health
    "pharmeasy","1mg","apollo","netmeds","medplus","cultfit",

    # Education
    "byjus","unacademy","vedantu","coursera","udemy","upgrad",

    # Gaming
    "dream11","mpl","my11circle","gamezy","winzo","ludo king"
    ]

    for brand in BRAND_LIST:
        if brand in text or brand in sender:
            return brand

    return "unknown"


def anonymize(text):
    text = ACCOUNT_REGEX.sub("<ACC>", text)
    text = PHONE_REGEX.sub("<PHONE>", text)
    text = UPI_REGEX.sub("<UPI>", text)
    return text

# =====================================================
# PIPELINE (Runs only if df is not empty)
# =====================================================
records = []

if not df.empty:
    for _, row in df.iterrows():
        text = row["text"]

        if is_noise(text):
            continue

        if not is_transaction(text):
            continue

        amount = extract_amount(text)
        if amount is None or amount <= 0:
            continue

        direction = extract_direction(text)

        # 🔥 CRITICAL FIX
        if is_self_transfer(text):
            txn_type = "transfer"
        else:
            txn_type = classify_txn_type(text, direction)

        records.append({
            "clean_text": anonymize(text),
            "amount": amount,
            "direction": direction,
            "txn_type": txn_type,
            "merchant": extract_merchant(text, row["senderAddress"], direction),
            "payment_type": extract_payment_type(text),
            "sender": row["senderAddress"],
            "date": row["updateAt"]
        })

if records:
    clean_df = pd.DataFrame(records)
    clean_df.to_csv("sms_transactions_clean.csv", index=False)
    print(f"✅ Extracted {len(clean_df)} transactions")
    print("📁 Saved as sms_transactions_clean.csv")
else:
    print("ℹ️ No transactions processed (CSV missing or empty).")