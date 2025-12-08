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
          `/api/user/${user._id}/flashcardsprogress`
        );
        const data = await response.json();
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
    <div className="flashcardsp-page">
      {flashcards.map((set, idx) => (
        <div key={idx} className="topic-section">
          {/* Topic Header */}
          <div className="topic-header">
            <h3>{set.topic}</h3>
            <p className="date">{new Date(set.date).toLocaleDateString()}</p>
          </div>

          {/* Horizontal row of flashcards */}
          <div className="topic-flashcardsp">
            {set.data.map((card, i) => (
              <div key={i} className="flashcardsp-container">
                <p className="question">{card.question}</p>
                <p className="answer">{card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardProgress;
