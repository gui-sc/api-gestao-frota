import { z } from 'zod';

export const getByRangeSchema = z.object({
    query: z.object({
        latitude: z.string().refine((latitude) => {
            return latitude !== '';
        }, { message: 'Informe a latitude' }),
        longitude: z.string().refine((longitude) => {
            return longitude !== '';
        }, { message: 'Informe a longitude' }),
        radius: z.string().refine((radius) => {
            return radius !== '';
        }, { message: 'Informe o raio' })
    })
})

export const createTravelSchema = z.object({
    body: z.object({
        latitude_destination: z.string().or(z.number()).transform(parseFloat),
        longitude_destination: z.string().or(z.number()).transform(parseFloat),
        latitude_origin: z.string().or(z.number()).transform(parseFloat),
        longitude_origin: z.string().or(z.number()).transform(parseFloat),
        actual_latitude_passenger: z.string().or(z.number()).transform(parseFloat),
        actual_longitude_passenger: z.string().or(z.number()).transform(parseFloat),
        passenger: z.string().or(z.number()).transform(Number),
        value: z.string().or(z.number()),
        destination: z.string(),
    })
})

export const removeTravelSchema = z.object({
    body: z.object({
        id: z.string()
    })
})

export const acceptTravelSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        driverId: z.number(),
        longitude: z.string().or(z.number()).transform(parseFloat),
        latitude: z.string().or(z.number()).transform(parseFloat)
    })
})

export const updateLocationSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        type: z.enum(['driver', 'passenger']),
        longitude: z.string().or(z.number()).transform(parseFloat),
        latitude: z.string().or(z.number()).transform(parseFloat)
    })
})

export const getByIdAndTypeSchema = z.object({
    params: z.object({
        id: z.string(),
        type: z.enum(['driver', 'passenger'])
    })
})