import pandas as pd

clean_df = pd.read_csv("sms_transactions_clean.csv")

# Parse date
clean_df["date"] = pd.to_datetime(clean_df["date"], errors="coerce")

# Create 1-minute time bucket
clean_df["time_bucket"] = clean_df["date"].dt.floor("min")

# Transaction fingerprint
clean_df["txn_fingerprint"] = (
    clean_df["amount"].astype(str) + "|" +
    clean_df["direction"] + "|" +
    clean_df["txn_type"] + "|" +
    clean_df["merchant"] + "|" +
    clean_df.get("payment_type", "NA") + "|" +
    clean_df["time_bucket"].astype(str)
)


# Deduplicate
dedup_df = (
    clean_df
    .sort_values("date")           # keep earliest SMS
    .drop_duplicates(
        subset=["txn_fingerprint"],
        keep="first"
    )
    .reset_index(drop=True)
)

# Drop helper columns
dedup_df.drop(columns=["time_bucket", "txn_fingerprint"], inplace=True)

# Save
dedup_df.to_csv("sms_transactions_deduped.csv", index=False)

print(f"🧹 Before dedup: {len(clean_df)}")
print(f"✅ After dedup: {len(dedup_df)}")
print("📁 Saved as sms_transactions_deduped.csv")
