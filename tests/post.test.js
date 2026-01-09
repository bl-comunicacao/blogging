require('dotenv').config();

// Configura variáveis de ambiente para testes (fora do Docker)
if (!process.env.DB_HOST || process.env.DB_HOST === 'postgres') {
  process.env.DB_HOST = 'localhost';
}
if (!process.env.DB_PORT || process.env.DB_PORT === '5432') {
  process.env.DB_PORT = '5433';
}

const request = require('supertest');
const app = require('../src/app');
let postCriado


describe('#GET /posts', () => {
  it('Deve retornar os posts existentes', async () => {
    const res = await request(app)
      .get('/posts')
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });
})

describe('#POST /posts', () => {
  it('Deve criar um post', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Revolução Industrial',
        content: 'A Revolução Industrial foi um processo de profundas transformações econômicas e sociais iniciado na Inglaterra no século XVIII. Ela marcou a substituição do trabalho artesanal pela produção em fábricas com uso de máquinas. O avanço tecnológico aumentou a produtividade e acelerou o crescimento das cidades. Ao mesmo tempo, surgiram novos problemas sociais, como jornadas excessivas e más condições de trabalho. Esse período consolidou o capitalismo industrial e mudou de forma definitiva a organização da sociedade.',
        author: 'Roberto Carlos'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.post.title).toBe('Revolução Industrial');

    // Salva o post criado para usar nos próximos testes
    postCriado = res.body.post;
  });
});

describe('#GET /posts/:id', () => {
  // Garante que o post foi criado antes de testar o GET por ID
  beforeAll(async () => {
    if (!postCriado) {
      const res = await request(app)
        .post('/posts')
        .send({
          title: 'Revolução Industrial',
          content: 'A Revolução Industrial foi um processo de profundas transformações econômicas e sociais iniciado na Inglaterra no século XVIII. Ela marcou a substituição do trabalho artesanal pela produção em fábricas com uso de máquinas. O avanço tecnológico aumentou a produtividade e acelerou o crescimento das cidades. Ao mesmo tempo, surgiram novos problemas sociais, como jornadas excessivas e más condições de trabalho. Esse período consolidou o capitalismo industrial e mudou de forma definitiva a organização da sociedade.',
          author: 'Roberto Carlos'
        });
      postCriado = res.body.post;
    }
  });

  it('Deve retornar o post criado pelo ID', async () => {
    expect(postCriado).toBeDefined();
    expect(postCriado.id).toBeDefined();

    const res = await request(app)
      .get(`/posts/${postCriado.id}`);

    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      id: postCriado.id,
      title: postCriado.title,
      content: postCriado.content,
      author: postCriado.author
    });
  });
});

