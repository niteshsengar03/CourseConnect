const z = require('zod');

const userSchema = z.object({
    email:z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
})

module.exports = {
    userSchema
}