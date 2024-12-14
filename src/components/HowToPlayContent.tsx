const stages = [
  {
    title: "1. Join a Game",
    content: "Enter a game room or create your own. Invite friends to join your room for more fun!"
  },
  {
    title: "2. Get Your Word",
    content: "When it's your turn to draw, you'll receive a random word or phrase to illustrate."
  },
  {
    title: "3. Draw Your Sketch",
    content: "Use the drawing tools to create a sketch that represents the given word. You have 60 seconds to complete your masterpiece!"
  },
  {
    title: "4. Other Guess",
    content: "When you're done drawing, another player tries to guess the word based on your sketch. They have 10 seconds to submit their guess."
  },
  {
    title: "5. Repeat",
    content: "The role of the artist rotates to the next player, except the new artist needs to draw what the previous player guessed instead of the original word."
  },
  {
    title: "6. Game End",
    content: "The game continues until every player has either guessed or drawn."
  },
  {
    title: "7. Voting",
    content: "Each player anonymously votes for the drawing that best matches the original word."
  },
  {
    title: "8. Scoring",
    content: "Points are awarded to the artist who got the most votes and to the players who voted for him."
  }
]

export function HowToPlayContent() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stages.map((stage, index) => (
        <div key={index} className="card bg-base-100 shadow-xl border-2 border-accent">
          <div className="card-body">
            <h2 className="card-title text-xl font-bold text-primary">{stage.title}</h2>
            <p className="text-base-content/70">{stage.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

