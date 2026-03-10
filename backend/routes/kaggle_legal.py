import os
import kagglehub
import pandas as pd
import re

bns_df = None

def load_datasets():
    global bns_df
    if bns_df is not None:
        return
    
    try:
        # Download the dataset
        path = kagglehub.dataset_download("nandr39/bharatiya-nyaya-sanhita-dataset-bns")
        csv_file = None
        for f in os.listdir(path):
            if f.endswith('.csv'):
                csv_file = os.path.join(path, f)
                break
        
        if csv_file:
            # Load the dataset
            bns_df = pd.read_csv(csv_file)
            print("Successfully loaded Kaggle BNS Dataset.")
    except Exception as e:
        print(f"Error loading Kaggle dataset: {e}")

def search_kaggle_datasets(question, limit=2):
    global bns_df
    if bns_df is None:
        load_datasets()
        
    if bns_df is None:
        return []
        
    # Process keywords
    keywords = [k for k in question.lower().split() if len(k) > 2]
    if not keywords:
        keywords = [question.lower()]
        
    regex_pattern = '|'.join([re.escape(k) for k in keywords])
    
    try:
        # Search by regex in Section _name and Description
        # Use fillna to avoid errors on empty records
        mask_name = bns_df['Section _name'].fillna('').str.contains(regex_pattern, case=False, regex=True)
        mask_desc = bns_df['Description'].fillna('').str.contains(regex_pattern, case=False, regex=True)
        
        matches = bns_df[mask_name | mask_desc].head(limit)
        
        results = []
        for _, row in matches.iterrows():
            section_name = row.get('Section _name', '')
            desc = row.get('Description', '')
            
            # Truncate description if too long
            if isinstance(desc, str) and len(desc) > 500:
                desc = desc[:500] + "..."
                
            results.append(f"**BNS Section {row.get('Section', '')}: {section_name}**\n\n{desc}")
            
        return results
    except Exception as e:
        print(f"Error searching Kaggle dataset: {e}")
        return []

# Initialize on import
load_datasets()
