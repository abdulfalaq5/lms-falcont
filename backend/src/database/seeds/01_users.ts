import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export const USER_IDS = {
  superAdmin: '11111111-1111-1111-1111-111111111111',
  admin: '22222222-2222-2222-2222-222222222222',
  instruktur1: '33333333-3333-3333-3333-333333333333',
  instruktur2: '33333333-3333-3333-3333-333333333334',
  user1: '44444444-4444-4444-4444-444444444444',
  user2: '44444444-4444-4444-4444-444444444445',
  user3: '44444444-4444-4444-4444-444444444446',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  await knex('users').insert([
    {
      id: USER_IDS.superAdmin,
      name: 'Super Admin',
      email: 'superadmin@lms.local',
      password_hash: passwordHash,
      role: 'super_admin',
      status: 'active',
    },
    {
      id: USER_IDS.admin,
      name: 'Admin LMS',
      email: 'admin@lms.local',
      password_hash: passwordHash,
      role: 'admin',
      status: 'active',
    },
    {
      id: USER_IDS.instruktur1,
      name: 'Budi Santoso',
      email: 'instruktur1@lms.local',
      password_hash: passwordHash,
      role: 'instruktur',
      status: 'active',
    },
    {
      id: USER_IDS.instruktur2,
      name: 'Siti Aminah',
      email: 'instruktur2@lms.local',
      password_hash: passwordHash,
      role: 'instruktur',
      status: 'active',
    },
    {
      id: USER_IDS.user1,
      name: 'Andi Wijaya',
      email: 'user1@lms.local',
      password_hash: passwordHash,
      role: 'user',
      status: 'active',
    },
    {
      id: USER_IDS.user2,
      name: 'Rina Marlina',
      email: 'user2@lms.local',
      password_hash: passwordHash,
      role: 'user',
      status: 'active',
    },
    {
      id: USER_IDS.user3,
      name: 'Dewi Lestari',
      email: 'user3@lms.local',
      password_hash: passwordHash,
      role: 'user',
      status: 'active',
    },
  ]);
}
