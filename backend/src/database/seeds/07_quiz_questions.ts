import type { Knex } from 'knex';
import { QUIZ_IDS } from './06_quizzes';

export const QUESTION_IDS = {
  q1: 'dddddddd-0000-0000-0000-000000000001',
  q2: 'dddddddd-0000-0000-0000-000000000002',
  q3: 'dddddddd-0000-0000-0000-000000000003',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('quiz_questions').del();

  await knex('quiz_questions').insert([
    {
      id: QUESTION_IDS.q1,
      quiz_id: QUIZ_IDS.webDevQuiz,
      question_text: 'Tag HTML untuk membuat paragraf adalah?',
      options: JSON.stringify(['<p>', '<div>', '<span>', '<h1>']),
      correct_answer: '<p>',
      type: 'pilihan_ganda',
    },
    {
      id: QUESTION_IDS.q2,
      quiz_id: QUIZ_IDS.webDevQuiz,
      question_text: 'Properti CSS untuk mengatur warna teks adalah?',
      options: JSON.stringify(['color', 'background', 'font-size', 'border']),
      correct_answer: 'color',
      type: 'pilihan_ganda',
    },
    {
      id: QUESTION_IDS.q3,
      quiz_id: QUIZ_IDS.uiuxQuiz,
      question_text: 'Jelaskan prinsip kontras dalam desain visual dan berikan contohnya.',
      options: null,
      correct_answer: null,
      type: 'essay',
    },
  ]);
}
