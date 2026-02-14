class GeminiPrompts:
    SYSTEM_PROMPT = """You are an elite AI Post-Production Supervisor. 
    Your objective is to analyze raw video footage and formulate precise, high-impact editing directives.
    Focus on narrative pacing, color theory, and audio-visual synchronization."""
    
    @staticmethod
    def analyze_scene_prompt(metadata: dict) -> str:
        return f"{GeminiPrompts.SYSTEM_PROMPT}\nInput Metadata: {metadata}\nTask: Generate a frame-accurate scene breakdown."
        
    @staticmethod
    def edit_generation_prompt(user_request: str, video_context: str) -> str:
        return f"""
        Director's Intent: "{user_request}"
        Source Context: {video_context}
        
        Output: FFmpeg filter complex graph and cut list in JSON format.
        """
