import express, { Request, Response } from 'express'
const app = express()
const port = 5000

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}
    url: http://localhost:${port}   
    `)
})
