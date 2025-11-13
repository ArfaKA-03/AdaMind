import React, { useEffect, useState } from "react";
import "./FlashcardProgress.css";

const FlashcardProgress = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("quizwhizz_user"));

  useEffect(() => {
    if (!user?._id) return;

    const fetchFlashcards = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/${user._id}/flashcardsprogress`
        );
        const data = await response.json();
        console.log("Fetched flashcards:", data);

        if (data.success) {
          setFlashcards(data.flashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  if (loading) return <p>Loading your saved flashcards...</p>;
  if (!flashcards.length)
    return <p className="no-flashcards">No flashcards saved yet 😕</p>;

  return (
    <div className="flashcard-progress">
      <h2>Your Saved Flashcards</h2>

      {flashcards.map((set, index) => (
        <div key={index} className="flashcard-set">
          <h3>{set.topic}</h3>
          <p className="date">
            Saved on {new Date(set.date).toLocaleDateString()}
          </p>

          <div className="flashcard-list">
            {set.data.map((card, i) => (
              <div key={i} className="flashcard-item">
                <p className="question">Q: {card.question}</p>
                <p className="answer">A: {card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardProgress;
