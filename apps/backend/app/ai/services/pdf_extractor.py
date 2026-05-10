import fitz


class PDFExtractor:

    @staticmethod
    def extract_text(
        pdf_path: str
    ) -> str:

        document = fitz.open(pdf_path)

        full_text = ""

        for page in document:
            full_text += page.get_text()

        return full_text
