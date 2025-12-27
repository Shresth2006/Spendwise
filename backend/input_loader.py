import pandas as pd

def load_from_sms_reader(sms_list):
    return pd.DataFrame(sms_list)

def load_from_paste(raw_text):
    return pd.DataFrame([{"text": raw_text}])

def load_from_csv(path):
    return pd.read_csv(path)
