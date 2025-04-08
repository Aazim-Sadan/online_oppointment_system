import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';

let studentToken, student2Token, professorToken, appointmentId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('End-to-End Appointment Flow', () => {

    test('Student A1 registers and logs in', async () => {
        await request(app).post('/auth/register').send({
            name: 'A1',
            email: 'a1@mail.com',
            password: '123456',
            role: 'student'
        });

        const res = await request(app).post('/auth/login').send({
            email: 'a1@mail.com',
            password: '123456'
        });

        studentToken = res.body.token;
        expect(res.statusCode).toBe(200);
    });

    test('Student A2 registers and logs in', async () => {
        await request(app).post('/auth/register').send({
            name: 'A2',
            email: 'a2@mail.com',
            password: '123456',
            role: 'student'
        });

        const res = await request(app).post('/auth/login').send({
            email: 'a2@mail.com',
            password: '123456'
        });

        student2Token = res.body.token;
        expect(res.statusCode).toBe(200);
    });

    test('Professor P1 registers and logs in', async () => {
        await request(app).post('/auth/register').send({ 
            name: 'P1', 
            email: 'p1@mail.com', 
            password: '123456', 
            role: 'professor' 
        });

        const res = await request(app).post('/auth/login').send({ 
            email: 'p1@mail.com', 
            password: '123456' 
        });

        professorToken = res.body.token;
        expect(res.statusCode).toBe(200);
    });

    test('Professor P1 adds availability', async () => {
        const res = await request(app)
            .post('/availability')
            .set('Authorization', `Bearer ${professorToken}`)
            .send({ slots: [new Date(), new Date(Date.now() + 3600000)] }); // 2 slots

        expect(res.statusCode).toBe(200);
    });

    let professorId;

    test('Student A1 views availability and books appointment', async () => {
        const professor = await request(app).post('/auth/login').send({ 
            email: 'p1@mail.com', 
            password: '123456' 
        });

        professorId = professor.body.user?.id;

        const res = await request(app)
            .get(`/availability/${professorId}`)
            .set('Authorization', `Bearer ${studentToken}`);

        const slot = res.body.availability?.slots[0];

        const book = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ professorId, time: slot });

        appointmentId = book.body.appointment?._id;
        expect(book.statusCode).toBe(201);
    });

    test('Student A2 books second appointment with P1', async () => {
        const res = await request(app)
            .get(`/availability/${professorId}`)
            .set('Authorization', `Bearer ${student2Token}`);

        const slot = res.body.availability?.slots[1];

        const book = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${student2Token}`)
            .send({ professorId, time: slot });

        expect(book.statusCode).toBe(201);
    });

    test('Professor P1 cancels appointment with A1', async () => {
        const cancel = await request(app)
            .delete(`/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${professorToken}`);

        expect(cancel.statusCode).toBe(200);
        expect(cancel.body.message).toBe("Appointment cancelled successfully");
    });

    test('Student A1 checks no pending appointments', async () => {
        const res = await request(app)
            .get('/appointments/me')
            .set('Authorization', `Bearer ${studentToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.appointments.length).toBe(0); // should be 0 after cancel
    });
});
