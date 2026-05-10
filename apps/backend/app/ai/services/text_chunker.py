class TextChunker:

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 2000
    ):
        chunks = []

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunks.append(
                text[start:end]
            )

            start = end

        return chunks
