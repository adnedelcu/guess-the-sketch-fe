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
    title: "4. Others Guess",
    content: "While you're drawing, other players try to guess the word based on your sketch. They can type their guesses in the chat."
  },
  {
    title: "5. Scoring",
    content: "Points are awarded to the first player who guesses correctly and to the artist if someone guesses the word."
  },
  {
    title: "6. Next Round",
    content: "The role of the artist rotates to the next player, and a new round begins with a new word."
  },
  {
    title: "7. Game End",
    content: "The game continues for a set number of rounds or until a player reaches a target score. The player with the highest score wins!"
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

