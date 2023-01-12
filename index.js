const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options.js");

const token = "5683709677:AAHgkoLTOEjVtKRtKdveYyVa3Xz_DLlJuT8";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю число от 0 до 9, а ты должен его угадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/6.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать в TG-бота`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал число ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, ты не угадал, бот загадал число ${chats[chatId]}`,
        againOptions
      );
    }

    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
  });
};

start();
