import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          quizTitle: "Cryptocurrency Quiz",
          loading: "Loading questions...",
          question: "Question",
          submitAnswer: "Submit Answer",
          nextQuestion: "Next Question",
          correct: "Correct!",
          incorrect: "Incorrect.",
          correctAnswerIs: "The correct answer is:",
          explanation: "Explanation:",
          generateNew: "Generate New Questions",
          errorRecords: "Error Records:",
          yourAnswer: "Your Answer:",
          language: "Language",
          home: "Home",
          practiseGame: "Practice Game",
          quiz: "Quiz",
          marketSim: "Market Simulation",
          login: "Login",
          generalQuestions: "General Questions",
          advancedQuestions: "Advanced Questions",
          whatIsMainBenefit:"What is the main benefit of {technology}?",
          transparency:"Transparency",
          speed:"Speed",
          costReduction:"Cost Reduction",
          security:"Security",
          transparencyExplanation:"Transparency is a key benefit as it allows all parties to see the transaction history.",
          howDoesImproveFinancialServices:"How does {technology} improve financial services?",
          eliminateBanks:"By eliminating banks",
          reduceFees:"By reducing fees",
          increaseTransactionSpeed:"By increasing transaction speed",
          allOfTheAbove:"All of the above",
          commonUseCase:"What is a common use case for {technology}?",
          socialMedia:"Social Media",
          supplyChainManagement:"Supply Chain Management",
          emailServices:"Email Services",
          videoStreaming:"Video Streaming",
          significantChallenge:"What is a significant challenge faced by {technology}?",
          scalability:"Scalability",
          adoption:"Adoption",
          regulation:"Regulation"
        }
      },
      zh:{
        translation:{
          quizTitle:"加密货币测验",
          loading:"正在加载问题...",
          question:"问题",
          submitAnswer:"提交答案",
          nextQuestion:"下一题",
          correct:"正确！",
          incorrect:"不正确。",
          correctAnswerIs:"正确答案是：",
          explanation:"解释：",
          generateNew:"生成新问题",
          errorRecords:"错误记录：",
          yourAnswer:"你的答案：",
          language:"语言",
          home:"主页",
          practiseGame:"练习游戏",
          quiz:"测验", 
          marketSim:"市场模拟", 
          login:"登录", 
          generalQuestions:"普通问题", 
          advancedQuestions:"高级问题", 
          whatIsMainBenefit:"{technology}的主要好处是什么？", 
          transparency:"透明度", 
          speed:"速度", 
          costReduction:"成本降低", 
        }
      },
      ja:{
        translation:{
           quizTitle:'暗号通貨クイズ',
           loading:'問題を読み込んでいます...',
           question:'問題',
           submitAnswer:'回答を送信',
           nextQuestion:'次の問題',
           correct:'正解！',
           incorrect:'不正解。',
           correctAnswerIs:'正解は：',
           explanation:'説明：',
           generateNew:'新しい問題を生成',
           errorRecords:'エラー記録：',
           yourAnswer:'あなたの回答：',
           language:'言語',
           home:'ホーム',
           practiseGame:'練習ゲーム',
           quiz:'クイズ', 
           marketSim:'マーケットシミュレーション', 
           login:'ログイン', 
           generalQuestions:'一般的な質問', 
           advancedQuestions:'高度な質問', 
           whatIsMainBenefit:'{technology}の主な利点は何ですか？', 
           transparency:'透明性', 
           speed:'速度', 
           costReduction:'コスト削減', 
        }
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;