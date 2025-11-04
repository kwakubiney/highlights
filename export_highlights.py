import sqlite3, json, os
from pathlib import Path

# Default Apple Books highlights DB
ANNOTATION_DB_PATH = str(Path.home() / "Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite")
LIBRARY_DB_PATH = str(Path.home() / "Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite")

def extract_highlights():
    # Connect to both databases
    annotation_conn = sqlite3.connect(ANNOTATION_DB_PATH)
    annotation_cur = annotation_conn.cursor()
    
    # Try to connect to library database for book titles
    library_conn = None
    library_cur = None
    book_info = {}
    
    try:
        library_conn = sqlite3.connect(LIBRARY_DB_PATH)
        library_cur = library_conn.cursor()
        
        # Get book titles and authors
        for row in library_cur.execute("SELECT ZASSETID, ZTITLE, ZAUTHOR FROM ZBKLIBRARYASSET"):
            asset_id, title, author = row
            book_info[asset_id] = {"title": title, "author": author}
    except Exception as e:
        print(f"Could not load book info from library database: {e}")
        print("Will use asset IDs as book titles instead")

    query = '''
    SELECT 
        ZANNOTATIONASSETID,
        ZANNOTATIONSELECTEDTEXT,
        ZANNOTATIONNOTE,
        ZANNOTATIONSTYLE,
        ZANNOTATIONCREATIONDATE
    FROM ZAEANNOTATION
    WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL
    ORDER BY ZANNOTATIONASSETID, ZANNOTATIONCREATIONDATE
    '''

    highlights = []
    for row in annotation_cur.execute(query):
        asset_id, text, note, style, created = row
        
        # Get book info from the dictionary if available
        book = book_info.get(asset_id, {})
        book_title = book.get("title", asset_id)
        author = book.get("author", "Unknown Author")
        
        highlights.append({
            "bookTitle": book_title or "Unknown",
            "author": author or "Unknown Author",
            "highlight": text,
            "note": note,
            "color": style,
            "createdDate": created
        })

    # Get the path relative to this script's location
    script_dir = Path(__file__).parent
    output_path = script_dir / "public" / "highlights.json"
    
    with open(output_path, "w") as f:
        json.dump(highlights, f, indent=2, ensure_ascii=False)

    print(f"Exported {len(highlights)} highlights → {output_path}")

if __name__ == "__main__":
    extract_highlights()
