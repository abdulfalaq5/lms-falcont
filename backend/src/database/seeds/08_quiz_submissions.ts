import type { Knex } from 'knex';
import { QUIZ_IDS } from './06_quizzes';
import { QUESTION_IDS } from './07_quiz_questions';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('quiz_submissions').del();

  await knex('quiz_submissions').insert([
    {
      quiz_id: QUIZ_IDS.webDevQuiz,
      user_id: USER_IDS.user1,
      answers: JSON.stringify({
        [QUESTION_IDS.q1]: '<p>',
        [QUESTION_IDS.q2]: 'color',
      }),
      score: 100,
    },
    {
      quiz_id: QUIZ_IDS.webDevQuiz,
      user_id: USER_IDS.user2,
      answers: JSON.stringify({
        [QUESTION_IDS.q1]: '<div>',
        [QUESTION_IDS.q2]: 'color',
      }),
      score: 50,
    },
  ]);
}
