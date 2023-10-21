/* eslint-disable no-new */
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import express, { json } from 'express'
import { CronJob } from 'cron'
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()
app.use(json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

bot.start((ctx) => {
  ctx.reply('Bienvenido, soy tu bot de la pagina web de reminder, porfavor coloca este id dentro de la configuración de la pagina web para que pueda funcionar correctamente')
  ctx.reply('' + ctx.chat.id)
//   chatId = ctx.chad.id
})

app.post('/verify-telegram-id', (req, res) => {
  const chatId = req.body.chatId
  console.log(chatId)
  if (!chatId) {
    res.status(400).json({ msg: 'Error', error: 'No se ha enviado el chatId' })
    return
  }

  bot.telegram.sendMessage(chatId, 'ChatId recibido correctamente, ahora ya puedo notificarte cuando tus reminders vayan a vencer')
  return res.status(200).json({ msg: 'ChatId recibido correctamente' })
})

app.post('/send-reminder', (req, res) => {
  const dateOfReminder = new Date(req.body.reminder.dateOfReminder)
  const reminderTitle = req.body.reminder.title
  const reminderDesc = req.body.reminder.description
  const dateToRemember = req.body.reminder.dateToRemember
  const chatId = req.body.chatId

  if (!dateOfReminder || !reminderTitle || !reminderDesc) {
    res.status(400).json({ msg: 'Error', error: 'No se han enviado todos los datos' })
    return
  }

  dateToRemember.forEach(date => {
    if (date === 'week') {
      const dateWeek = new Date(dateOfReminder)
      dateWeek.setDate(dateWeek.getDate() - 7)
      new CronJob(dateWeek, () => {
        console.log('Se ha ejecutado el cron week')
        bot.telegram.sendMessage(chatId, `Tu reminder: ${reminderTitle} va a vencer en una semana, recuerda: ${reminderDesc}`)
      }, true, 'America/Guayaquil')
    }
    if (date === 'day') {
      const dateDay = new Date(dateOfReminder)
      dateDay.setDate(dateDay.getDate() - 1)
      new CronJob(dateDay, () => {
        console.log('Se ha ejecutado el cron day')
        bot.telegram.sendMessage(chatId, `Tu reminder: ${reminderTitle} va a vencer en un dia, recuerda: ${reminderDesc}`)
      }, true, 'America/Guayaquil')
    }
    if (date === 'hour') {
      const dateHour = new Date(dateOfReminder)
      dateHour.setHours(dateHour.getHours() - 1)
      new CronJob(dateHour, () => {
        console.log('Se ha ejecutado el cron hour')
        bot.telegram.sendMessage(chatId, `Tu reminder: ${reminderTitle} va a vencer en una hora, recuerda: ${reminderDesc}`)
      }, true, 'America/Guayaquil')
    }
    if (date === 'minutes') {
      const dateMinute = new Date(dateOfReminder)
      dateMinute.setMinutes(dateMinute.getMinutes() - 15)
      new CronJob(dateMinute, () => {
        console.log('Se ha ejecutado el cron minute')
        bot.telegram.sendMessage(chatId, `Tu reminder: ${reminderTitle} va a vencer en 15 minutos, recuerda: ${reminderDesc}`)
      }, true, 'America/Guayaquil')
    }
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

bot.launch()
