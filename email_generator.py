import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def main():
    api_key = os.getenv("GROQ_API_KEY") #Getting the API key from .env file
    sender_name = os.getenv("SENDER_NAME", "Your Name") #Getting the Sender Name from .env file
    organisation = os.getenv("ORGANISATION", "Your Organisation") #Getting the Organisation name form .env file
    if not api_key:
        api_key = input("Enter your Groq API key: ").strip()

    client = Groq(api_key=api_key) #Configure the Groq client

    #Getting Email purpose, recipient, role
    print("\n--- AI Email Generator ---\n")
    purpose = input("Email Purpose: ").strip()
    recipient = input("Recipient Name: ").strip()
    position = input("Position/Role: ").strip()

    #Collecting Key points
    print("Key Points (press ENTER on the blank line to finish):")
    key_points = []
    while True:
        point = input(" > ").strip()
        if not point:
            break
        key_points.append(point)

    #Choosing tone
    print("\nSelect tone:")
    print(" 1. Professional")
    print(" 2. Friendly")
    print(" 3. Formal")
    tone_choice = input("Enter 1, 2, or 3: ").strip()
    tones = {"1": "professional", "2": "friendly", "3": "formal"}
    tone = tones.get(tone_choice, "professional")

    #Building the prompt
    points_text = "\n".join(f"- {p}" for p in key_points)
    prompt = f"""Write a {tone} email to {recipient} about: {purpose} for the position of {position} at {organisation}.
Include these key points:
{points_text}

Sign off with the name {sender_name} from {organisation}.
Format it with Subject line, greeting, body, and sign-off."""

    #Call Groq and print the result
    print("\nGenerating email...\n")
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    email_text = response.choices[0].message.content
    print("=" * 50)
    print(email_text)
    print("=" * 50)

    #Offer to save the email
    save = input("\nSave to file? (y/n): ").strip().lower()
    if save == "y":
        filename = input("Enter filename (without .txt): ").strip() + ".txt"
        with open(filename, "w") as f:
            f.write(email_text)
        print(f"Saved to {filename}")


if __name__ == "__main__":
    main()
