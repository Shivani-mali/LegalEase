import kagglehub
import pandas as pd
import os

def check_dataset(name):
    print(f"Downloading {name}...")
    try:
        path = kagglehub.dataset_download(name)
        print("Path:", path)
        print("Files:", os.listdir(path))
        
        for file in os.listdir(path):
            if file.endswith('.csv'):
                df = pd.read_csv(os.path.join(path, file))
                print(f"CSV {file} shape:", df.shape)
                print("Columns:", df.columns.tolist())
                print(df.head(2))
                break
    except Exception as e:
        print(f"Error with {name}: {e}")

if __name__ == "__main__":
    check_dataset("nandr39/bharatiya-nyaya-sanhita-dataset-bns")
    # check_dataset("kausthubkannan/laws-and-acts-of-india")
    # check_dataset("akshatgupta7/llm-fine-tuning-dataset-of-indian-legal-texts")
