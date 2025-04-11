import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';

let studentToken, student2Token, professorToken, appointmentId;

beforeAll(async () => {
    // await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
});

describe('End-to-End Appointment Flow', () => {

    test('Student A1 registers and logs in', async () => {
        await request(app).post('/auth/register').send({
            name: 'A1',
            email: 'a1@mail.com',
            password: '123456',
            role: 'student'
        });
        console.log('Student A1 registered');

        const res = await request(app).post('/auth/login').send({
            email: 'a1@mail.com',
            password: '123456'
        });

        studentToken = res.body.token;
        console.log('Student A1 logged in');
        expect(res.statusCode).toBe(200);
    });

    test('Student A2 registers and logs in', async () => {
        await request(app).post('/auth/register').send({
            name: 'A2',
            email: 'a2@mail.com',
            password: '123456',
            role: 'student'
        });
        console.log('Student A2 registered');

        const res = await request(app).post('/auth/login').send({
            email: 'a2@mail.com',
            password: '123456'
        });

        student2Token = res.body.token;
        console.log('Student A2 logged in');
        expect(res.statusCode).toBe(200);
    });

    test('Professor P1 registers and logs in', async () => {
        await request(app).post('/auth/register').send({
            name: 'P1',
            email: 'p1@mail.com',
            password: '123456',
            role: 'professor'
        });
        console.log('Professor P1 registered');

        const res = await request(app).post('/auth/login').send({
            email: 'p1@mail.com',
            password: '123456'
        });

        professorToken = res.body.token;
        console.log('Professor P1 logged in');
        expect(res.statusCode).toBe(200);
    });

    test('Professor P1 adds availability', async () => {
        const res = await request(app)
            .post('/availability')
            .set('Authorization', `Bearer ${professorToken}`)
            .send({ slots: [new Date(), new Date(Date.now() + 3600000)] }); // 2 slots

        console.log('Professor P1 added availability');
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

        console.log('Student A1 viewed availability');

        const slot = res.body.availability?.slots[0];

        const book = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ professorId, time: slot });

        appointmentId = book.body.appointment?._id;
        console.log('Student A1 booked appointment');
        expect(book.statusCode).toBe(201);
    });

    test('Student A2 books second appointment with P1', async () => {
        const res = await request(app)
            .get(`/availability/${professorId}`)
            .set('Authorization', `Bearer ${student2Token}`);


        console.log('Availability:', res.body);

        const slot = res.body.availability?.slots[1];

        if (!slot) {
            console.error('No second slot available for Student A2 to book');
            return;
        }

        const book = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${student2Token}`)
            .send({ professorId, time: slot });


        console.log('Booking Response:', book.body);


        expect(book.statusCode).toBe(201);
        console.log('Student A2 booked an appointment');
    });

    test('Professor P1 cancels appointment with A1', async () => {
        const cancel = await request(app)
            .delete(`/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${professorToken}`);

        expect(cancel.statusCode).toBe(200);
        expect(cancel.body.message).toBe("Appointment cancelled successfully");
        console.log('Professor P1 cancelled the appointment with Student A1');
    });

});
