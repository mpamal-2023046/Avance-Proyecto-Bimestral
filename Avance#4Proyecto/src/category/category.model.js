'use strict'

import { Schema, model } from 'mongoose'

const categorySchema = Schema (
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [35, `Can't be overcome 35 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [50, `Can't be overcome 35 characters`]
        },
        clasification: {
            type: String,
            uppercase: true,
            enum: ['CATEGORY', 'DEFAULT'],
            required: [true, 'Clasification is required'],
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('category', categorySchema)
