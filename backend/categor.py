# categor.py

CATEGORY_KEYWORDS = {
    "Food & Dining": ["zomato limited", "swiggy", "dominos", "pizza", "kfc", "restaurant", "cafe", "hotel", "dining"],
    "Groceries": ["blinkit", "zepto", "bigbasket", "grocery", "dmart", "reliance fresh", "more", "store"],
    "Transport": ["uber", "ola", "rapido", "yulu", "bus", "metro", "petrol", "diesel", "fuel", "toll"],
    "Utilities": ["electricity", "water", "gas", "broadband", "recharge", "airtel", "jio", "vodafone", "vi", "bsnl", "postpaid", "prepaid"],
    "Housing": ["rent", "maintenance", "society", "apartment", "housing", "flat", "property"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho", "tatacliq"],
    "Health & Fitness": ["pharmacy", "hospital", "apollo", "1mg", "netmeds", "doctor", "clinic", "gym", "cultfit"],
    "Entertainment": ["netflix", "prime", "hotstar", "spotify", "movie", "theatre", "bookmyshow"],
    "Travel": ["irctc", "makemytrip", "goibibo", "yatra", "ixigo", "flight", "train", "hotel", "oyo"],
    "Education": ["byjus", "unacademy", "vedantu", "udemy", "coursera", "fees", "college", "school"],
    "Investments": ["mutual fund", "sip", "groww", "zerodha", "upstox", "stocks", "investment", "equity"],
    "Loan": ["emi", "loan", "repayment", "due amount", "bnpl", "pay later", "credit card bill"],
    "Gifts": ["gift", "present", "voucher", "amazon gift", "flipkart gift"]
}

def classify_category(clean_text: str, merchant: str, txn_type: str) -> str:
    text = str(clean_text).lower()
    merchant = str(merchant).lower()

    # 1. Hard rules (highest priority)
    if txn_type == "income": return "Income"
    if txn_type == "cash_withdrawal": return "Cash Withdrawal"
    if txn_type == "fee": return "Fees & Charges"
    if txn_type == "reward": return "Rewards"
    if txn_type == "refund": return "Refunds"

    # 2. Keyword-based categories
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(k in text for k in keywords) or any(k in merchant for k in keywords):
            return category

    # 3. Transfers logic
    if txn_type == "transfer": return "Transfers"

    return "Miscellaneous"