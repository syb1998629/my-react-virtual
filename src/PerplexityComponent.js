import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PerplexityComponent.css';

const PerplexityComponent = () => {
  const { t, i18n } = useTranslation();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorRecords, setErrorRecords] = useState([]);

  const [userCharacteristics,] = useState({
    interests: ['blockchain', 'DeFi']
  });

  const [questionType, setQuestionType] = useState('general');

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  const questionPool = {
    general: [
      {
        template: t("whatIsMainBenefit"),
        options: [t("transparency"), t("speed"), t("costReduction"), t("security")],
        correctAnswer: "A",
        explanation: t("transparencyExplanation")
      },
      {
        template: t("howDoesImproveFinancialServices"),
        options: [t("eliminateBanks"), t("reduceFees"), t("increaseTransactionSpeed"), t("allOfTheAbove")],
        correctAnswer: "D",
        explanation: t("allBenefitsExplanation")
      }
    ],
    advanced: [
      {
        template: t("commonUseCase"),
        options: [t("socialMedia"), t("supplyChainManagement"), t("emailServices"), t("videoStreaming")],
        correctAnswer: "B",
        explanation: t("supplyChainExplanation")
      },
      {
        template: t("significantChallenge"),
        options: [t("scalability"), t("adoption"), t("regulation"), t("allOfTheAbove")],
        correctAnswer: "D",
        explanation: t("challengesExplanation")
      }
    ]
  };

  const generatePerplexityQuestion = async (topic) => {
    console.log("Generating question for topic:", topic); // 添加日志
    try {
      const apiKey = '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';
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "Be precise and concise. Generate a multiple choice question about the given topic with 4 options and indicate the correct answer."
            },
            {
              role: "user",
              content: `Generate a multiple choice question about ${topic}.`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 150,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("API response:", data); // 添加日志
      return parseApiResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching question from Perplexity API:", error.message);
      return null;
    }
  };
      
      
  const parseApiResponse = (content) => {
  console.log("Parsing API response:", content); // 保留这行日志
  try {
    const lines = content.split('\n');
    const question = lines[0].replace('**Question: ', '').replace('**', '');
    const options = lines.slice(1, -2).map(line => line.trim().replace(/^[A-D]\) /, ''));
    const correctAnswerLine = lines.find(line => line.toLowerCase().includes('correct answer'));
    const correctAnswer = correctAnswerLine ? correctAnswerLine.split(':')[1].trim().charAt(0) : '';
    return {
      text: question,
      options: options,
      correctAnswer: correctAnswer,
      explanation: "Explanation placeholder"
    };
  } catch (error) {
    console.error("Error parsing API response:", error);
    return null;
  }
};
  const generateRandomQuestion = async () => {
    try {
      const topic = userCharacteristics.interests[0];
      const question = await generatePerplexityQuestion(topic);
      if (question === null) {
        if (!questionPool[questionType] || questionPool[questionType].length === 0) {
          throw new Error("Question pool is empty");
        }
        const fallbackQuestion = questionPool[questionType][Math.floor(Math.random() * questionPool[questionType].length)];
        return {
          question: fallbackQuestion.template.replace("{technology}", topic),
          options: fallbackQuestion.options,
          correctAnswer: fallbackQuestion.correctAnswer,
          explanation: fallbackQuestion.explanation
        };
      }
      return question;
    } catch (error) {
      console.error("Error generating random question:", error);
      return null;
    }
  };

  const generateQuestions = async () => {
    setLoading(true);
    const generatedQuestions = [];
    const questionCount = 10;
    for (let i = 0; i < questionCount; i++) {
      const newQuestion = await generateRandomQuestion();
      if (newQuestion !== null) {
        generatedQuestions.push(newQuestion);
      }
    }
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setFeedback('');
    setUserAnswer('');
    setLoading(false);
  };

  const generateNewQuestionFromAnswer = (userAnswer, correctAnswer) => {
    if (userAnswer !== correctAnswer) {
      return {
        question: `Why is ${correctAnswer} the correct answer to the previous question?`,
        options: ["It's more secure", "It's faster", "It's cheaper", "It has better transparency"],
        correctAnswer: "A",
        explanation: t("securityExplanation")
      };
    }
    return null;
  };

  const analyzeUserAnswer = (userAnswer, correctAnswer, explanation) => {
    if (userAnswer === correctAnswer) {
      return { isCorrect: true, feedback: t('correct') };
    } else {
      return { isCorrect: false, feedback: `${t('incorrect')} ${t('correctAnswerIs')} ${correctAnswer}. ${explanation}` };
    }
  };

  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const analysisResult = analyzeUserAnswer(userAnswer, currentQuestion.correctAnswer, currentQuestion.explanation);
    setFeedback(analysisResult.feedback);

    if (!analysisResult.isCorrect) {
      const newErrorRecord = {
        question: currentQuestion.question,
        userAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        timestamp: new Date().toISOString()
      };
      setErrorRecords(prevRecords => [...prevRecords, newErrorRecord]);

      const newQuestion = generateNewQuestionFromAnswer(userAnswer, currentQuestion.correctAnswer);
      if (newQuestion) {
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback('');
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      await generateQuestions();
    };
    fetchQuestions();
  }, [questionType, i18n.language]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{t('quizTitle')}</h2>

      <div className="question-type-selector">
        <label>
          <input 
            type="radio" 
            value="general" 
            checked={questionType === 'general'} 
            onChange={(e) => setQuestionType(e.target.value)} 
          />
          {t('generalQuestions')}
        </label>
        <label>
          <input 
            type="radio" 
            value="advanced" 
            checked={questionType === 'advanced'} 
            onChange={(e) => setQuestionType(e.target.value)} 
          />
          {t('advancedQuestions')}
        </label>
      </div>

      {loading ? (
        <p className="loading">{t('loading')}</p>
      ) : (
        <>
          {currentQuestion && (
            <div className="question-container">
              <p className="question-number">{t('question', { number: currentQuestionIndex + 1 })} of {questions.length}</p>
              <p className="question">{currentQuestion.question}</p>
              <div className="options">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option">
                    <label htmlFor={`answer-${currentQuestionIndex}-${index}`}>
                      <input
                        type="radio"
                        name="answer"
                        id={`answer-${currentQuestionIndex}-${index}`}
                        value={getOptionLabel(index)}
                        checked={userAnswer === getOptionLabel(index)}
                        onChange={(e) => setUserAnswer(e.target.value)}
                      />
                      {getOptionLabel(index)}. {option}
                    </label>
                  </div>
                ))}
              </div>
              <div className="button-container">
                <button onClick={checkAnswer} disabled={!userAnswer}>{t('submitAnswer')}</button>
                {currentQuestionIndex < questions.length - 1 && (
                  <button onClick={nextQuestion} disabled={!feedback}>{t('nextQuestion')}</button>
                )}
              </div>
              {feedback && (
                <div className={`feedback ${feedback.includes(t('correct')) ? 'correct' : 'incorrect'}`}>
                  <p>{feedback}</p>
                </div>
              )}
            </div>
          )}
          <button onClick={generateQuestions}>{t('generateNew')}</button>
        </>
      )}

      {errorRecords.length > 0 && (
        <div className="error-records">
          <h3>{t('errorRecords')}</h3>
          <ul>
            {errorRecords.map((record, index) => (
              <li key={index}>
                <strong>{t('question')}:</strong> {record.question}<br />
                <strong>{t('yourAnswer')}:</strong> {record.userAnswer}<br />
                <strong>{t('correctAnswerIs')}:</strong> {record.correctAnswer}<br />
                <strong>{t('explanation')}:</strong> {record.explanation}<br />
                <strong>{t('timestamp')}:</strong> {record.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PerplexityComponent;