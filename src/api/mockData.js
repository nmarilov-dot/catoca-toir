export const MOCK_EQUIPMENT = [
  // ФАБРИКА 2
  { id: 'f-2', parentId: null, name: 'ФАБРИКА 2', isEquipment: false },
  { id: 'f-2-1', parentId: 'f-2', name: 'Fase-1', isEquipment: false },
  
  // Уровень 3: Оборудование
  { id: 'eq-1', parentId: 'f-2-1', name: 'Приемный бункер', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-2', parentId: 'f-2-1', name: 'Питатель', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-3', parentId: 'f-2-1', name: 'Дробилка', isEquipment: true, status: 'not_working', lastStatusChange: '2026-05-12T02:30:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-4', parentId: 'f-2-1', name: 'Конвейер 101', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-5', parentId: 'f-2-1', name: 'Перегрузка 101-102', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-6', parentId: 'f-2-1', name: 'Конвейер 102', isEquipment: true, status: 'ppm', lastStatusChange: '2026-05-11T10:00:00Z', statusAuthor: 'admin' },
  
  // Уровень 4, 5, 6: Глубокая вложенность для конвейера 102
  { id: 'eq-6-1', parentId: 'eq-6', name: 'Привод конвейера 102', isEquipment: true, status: 'working', lastStatusChange: '2026-05-11T10:00:00Z', statusAuthor: 'admin' },
  { id: 'eq-6-1-1', parentId: 'eq-6-1', name: 'Электродвигатель 50кВт', isEquipment: true, status: 'working', lastStatusChange: '2026-05-11T10:00:00Z', statusAuthor: 'admin' },
  { id: 'eq-6-1-1-1', parentId: 'eq-6-1-1', name: 'Подшипниковый узел', isEquipment: true, status: 'working', lastStatusChange: '2026-05-11T10:00:00Z', statusAuthor: 'admin' },

  { id: 'eq-7', parentId: 'f-2-1', name: 'Перегрузка 102-103', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-8', parentId: 'f-2-1', name: 'Конвейер 103', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-9', parentId: 'f-2-1', name: 'Перегрузка 103-104', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  { id: 'eq-10', parentId: 'f-2-1', name: 'Конвейер 104', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },
  
  // ФАБРИКА 2 -> Участок дробления
  { id: 'f-2-2', parentId: 'f-2', name: 'Участок дробления', isEquipment: false },
  { id: 'eq-11', parentId: 'f-2-2', name: 'Бункер №1', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' },

  // ФАБРИКА 1
  { id: 'f-1', parentId: null, name: 'ФАБРИКА 1', isEquipment: false },
  { id: 'f-1-1', parentId: 'f-1', name: 'Цех измельчения', isEquipment: false },
  { id: 'eq-12', parentId: 'f-1-1', name: 'Мельница ММС 70-23', isEquipment: true, status: 'working', lastStatusChange: '2026-05-10T08:00:00Z', statusAuthor: 'dispacho' }
];

export const MOCK_TICKETS = [
  // ========== АВАРИЙНЫЕ ТИКЕТЫ ==========
  {
    id: 't-1',
    equipmentId: 'eq-3',
    author: 'user',
    authorName: 'Иван Механик',
    service: 'Механики',
    status: 'not_completed',
    type: 'accident',
    description: 'Заклинило ротор. Требуется осмотр подшипников.',
    createdAt: '2026-05-12T03:00:00Z',
    targetDate: '2026-05-12T12:00:00Z',
    completedAt: null,
    downtimeHours: 9.5,
    delayReason: null,
    delayService: null,
    comments: [
      { id: 'c-1', authorName: 'Иван Механик', text: 'Ожидаем бригаду электриков для отключения питания.', timestamp: '2026-05-12T03:15:00Z' }
    ]
  },
  {
    id: 't-3',
    equipmentId: 'eq-4',
    author: 'user',
    authorName: 'Иван Механик',
    service: 'Механики',
    status: 'completed',
    type: 'accident',
    description: 'Обрыв скребка. Заменены 3 секции.',
    createdAt: '2026-05-08T14:00:00Z',
    targetDate: '2026-05-09T08:00:00Z',
    completedAt: '2026-05-09T06:30:00Z',
    downtimeHours: 16.5,
    delayReason: null,
    delayService: null,
    comments: [
      { id: 'c-2', authorName: 'Иван Механик', text: 'Работы завершены, конвейер запущен.', timestamp: '2026-05-09T06:30:00Z' }
    ]
  },
  {
    id: 't-4',
    equipmentId: 'eq-1',
    author: 'user',
    authorName: 'Петр Электрик',
    service: 'Электрики',
    status: 'completed',
    type: 'accident',
    description: 'Выход из строя пускателя. Замена контактора КТ-6033.',
    createdAt: '2026-05-07T22:00:00Z',
    targetDate: '2026-05-08T06:00:00Z',
    completedAt: '2026-05-08T04:15:00Z',
    downtimeHours: 6.25,
    delayReason: null,
    delayService: null,
    comments: []
  },
  {
    id: 't-5',
    equipmentId: 'eq-8',
    author: 'user',
    authorName: 'Иван Механик',
    service: 'Механики',
    status: 'not_completed',
    type: 'accident',
    description: 'Износ футеровки приемной воронки. Пробой ленты.',
    createdAt: '2026-05-10T11:00:00Z',
    targetDate: '2026-05-14T08:00:00Z',
    completedAt: null,
    downtimeHours: 0,
    delayReason: 'tmc',
    delayService: 'Снабжение',
    comments: [
      { id: 'c-3', authorName: 'Иван Механик', text: 'Необходимы листы Hardox 450 толщиной 10мм.', timestamp: '2026-05-10T11:30:00Z' },
      { id: 'c-4', authorName: 'Отдел Снабжения', text: 'Заказано. Поставка ожидается 13.05.', timestamp: '2026-05-10T15:00:00Z' }
    ]
  },
  {
    id: 't-6',
    equipmentId: 'eq-12',
    author: 'user',
    authorName: 'Сергей Автоматик',
    service: 'Автоматики',
    status: 'completed',
    type: 'accident',
    description: 'Сбой датчика давления масла. Ложное срабатывание защиты.',
    createdAt: '2026-05-06T08:00:00Z',
    targetDate: '2026-05-06T12:00:00Z',
    completedAt: '2026-05-06T10:45:00Z',
    downtimeHours: 2.75,
    delayReason: null,
    delayService: null,
    comments: [
      { id: 'c-5', authorName: 'Сергей Автоматик', text: 'Датчик откалиброван. Уставка скорректирована.', timestamp: '2026-05-06T10:45:00Z' }
    ]
  },
  {
    id: 't-7',
    equipmentId: 'eq-2',
    author: 'user',
    authorName: 'Петр Электрик',
    service: 'Электрики',
    status: 'not_completed',
    type: 'accident',
    description: 'Перегрев двигателя питателя. Требуется проверка обмоток.',
    createdAt: '2026-05-11T16:00:00Z',
    targetDate: '2026-05-13T08:00:00Z',
    completedAt: null,
    downtimeHours: 4,
    delayReason: 'tmc',
    delayService: 'Снабжение',
    comments: [
      { id: 'c-6', authorName: 'Петр Электрик', text: 'Необходим запасной электродвигатель 30кВт.', timestamp: '2026-05-11T16:30:00Z' }
    ]
  },
  // ========== ПЛАНОВЫЕ РЕМОНТЫ (ППР) ==========
  {
    id: 't-2',
    equipmentId: 'eq-6',
    author: 'admin',
    authorName: 'Администратор системы',
    service: 'Механики',
    status: 'not_completed',
    type: 'ppm',
    description: 'Плановая замена роликов.',
    createdAt: '2026-05-11T10:00:00Z',
    targetDate: '2026-05-15T12:00:00Z',
    completedAt: null,
    downtimeHours: 8,
    delayReason: null,
    delayService: null,
    comments: []
  },
  {
    id: 't-8',
    equipmentId: 'eq-10',
    author: 'user',
    authorName: 'Иван Механик',
    service: 'Механики',
    status: 'completed',
    type: 'ppm',
    description: 'Ревизия натяжного устройства. Замена пружин.',
    createdAt: '2026-05-05T08:00:00Z',
    targetDate: '2026-05-05T18:00:00Z',
    completedAt: '2026-05-05T16:30:00Z',
    downtimeHours: 8.5,
    delayReason: null,
    delayService: null,
    comments: [
      { id: 'c-7', authorName: 'Иван Механик', text: 'Все работы по регламенту выполнены.', timestamp: '2026-05-05T16:30:00Z' }
    ]
  },
  {
    id: 't-9',
    equipmentId: 'eq-5',
    author: 'user',
    authorName: 'Петр Электрик',
    service: 'Электрики',
    status: 'completed',
    type: 'ppm',
    description: 'Профилактика электрооборудования перегрузки.',
    createdAt: '2026-05-04T08:00:00Z',
    targetDate: '2026-05-04T14:00:00Z',
    completedAt: '2026-05-04T13:00:00Z',
    downtimeHours: 5,
    delayReason: null,
    delayService: null,
    comments: []
  },
  {
    id: 't-10',
    equipmentId: 'eq-11',
    author: 'user',
    authorName: 'Сергей Автоматик',
    service: 'Автоматики',
    status: 'not_completed',
    type: 'ppm',
    description: 'Калибровка весового дозатора и замена тензодатчиков.',
    createdAt: '2026-05-09T08:00:00Z',
    targetDate: '2026-05-16T08:00:00Z',
    completedAt: null,
    downtimeHours: 0,
    delayReason: 'tmc',
    delayService: 'Снабжение',
    comments: [
      { id: 'c-8', authorName: 'Сергей Автоматик', text: 'Тензодатчики CAS BSA на складе отсутствуют.', timestamp: '2026-05-09T10:00:00Z' },
      { id: 'c-9', authorName: 'Отдел Снабжения', text: 'Заявка на закупку отправлена поставщику. Срок 2-3 недели.', timestamp: '2026-05-09T14:00:00Z' }
    ]
  },
  {
    id: 't-11',
    equipmentId: 'eq-9',
    author: 'user',
    authorName: 'Иван Механик',
    service: 'Механики',
    status: 'completed',
    type: 'accident',
    description: 'Разрыв компенсатора. Экстренная замена.',
    createdAt: '2026-04-28T20:00:00Z',
    targetDate: '2026-04-29T08:00:00Z',
    completedAt: '2026-04-29T05:00:00Z',
    downtimeHours: 9,
    delayReason: null,
    delayService: null,
    comments: []
  },
  {
    id: 't-12',
    equipmentId: 'eq-7',
    author: 'user',
    authorName: 'Петр Электрик',
    service: 'Электрики',
    status: 'completed',
    type: 'ppm',
    description: 'Замена кабельных муфт и ревизия заземления.',
    createdAt: '2026-04-20T08:00:00Z',
    targetDate: '2026-04-20T18:00:00Z',
    completedAt: '2026-04-20T17:00:00Z',
    downtimeHours: 9,
    delayReason: null,
    delayService: null,
    comments: []
  }
];

// Записи истории простоев оборудования
export const MOCK_DOWNTIME_LOG = [
  { id: 'd-1', equipmentId: 'eq-3', startTime: '2026-05-12T02:30:00Z', endTime: null, hours: null, reason: 'Заклинил ротор', service: 'Механики', ticketId: 't-1' },
  { id: 'd-2', equipmentId: 'eq-4', startTime: '2026-05-08T14:00:00Z', endTime: '2026-05-09T06:30:00Z', hours: 16.5, reason: 'Обрыв скребка', service: 'Механики', ticketId: 't-3' },
  { id: 'd-3', equipmentId: 'eq-1', startTime: '2026-05-07T22:00:00Z', endTime: '2026-05-08T04:15:00Z', hours: 6.25, reason: 'Выход из строя пускателя', service: 'Электрики', ticketId: 't-4' },
  { id: 'd-4', equipmentId: 'eq-12', startTime: '2026-05-06T08:00:00Z', endTime: '2026-05-06T10:45:00Z', hours: 2.75, reason: 'Сбой датчика давления', service: 'Автоматики', ticketId: 't-6' },
  { id: 'd-5', equipmentId: 'eq-2', startTime: '2026-05-11T16:00:00Z', endTime: null, hours: 4, reason: 'Перегрев двигателя (ожидание ТМЦ)', service: 'Электрики', ticketId: 't-7' },
  { id: 'd-6', equipmentId: 'eq-6', startTime: '2026-05-11T10:00:00Z', endTime: null, hours: 8, reason: 'ППР: замена роликов', service: 'Механики', ticketId: 't-2' },
  { id: 'd-7', equipmentId: 'eq-10', startTime: '2026-05-05T08:00:00Z', endTime: '2026-05-05T16:30:00Z', hours: 8.5, reason: 'ППР: ревизия натяжного устройства', service: 'Механики', ticketId: 't-8' },
  { id: 'd-8', equipmentId: 'eq-5', startTime: '2026-05-04T08:00:00Z', endTime: '2026-05-04T13:00:00Z', hours: 5, reason: 'ППР: профилактика электрооборудования', service: 'Электрики', ticketId: 't-9' },
  { id: 'd-9', equipmentId: 'eq-9', startTime: '2026-04-28T20:00:00Z', endTime: '2026-04-29T05:00:00Z', hours: 9, reason: 'Разрыв компенсатора', service: 'Механики', ticketId: 't-11' },
  { id: 'd-10', equipmentId: 'eq-7', startTime: '2026-04-20T08:00:00Z', endTime: '2026-04-20T17:00:00Z', hours: 9, reason: 'ППР: замена кабельных муфт', service: 'Электрики', ticketId: 't-12' },
  { id: 'd-11', equipmentId: 'eq-8', startTime: '2026-05-10T11:00:00Z', endTime: null, hours: 0, reason: 'Износ футеровки (ожидание ТМЦ)', service: 'Механики', ticketId: 't-5' },
];

export const MOCK_MATERIALS = [
  {
    id: 'm-1',
    itemName: 'Подшипник SKF 6205',
    quantity: 2,
    unit: 'шт',
    urgency: 'critical',
    equipmentId: 'eq-3', // Дробилка
    ticketId: 't-1',
    authorName: 'Иван Механик',
    status: 'ordered',
    createdAt: '2026-05-12T03:30:00Z',
    comment: 'Каталожный номер 123-456'
  },
  {
    id: 'm-2',
    itemName: 'Транспортерная лента (ширина 800мм)',
    quantity: 50,
    unit: 'м',
    urgency: 'planned',
    equipmentId: 'eq-6', // Конвейер 102
    ticketId: 't-2',
    authorName: 'Администратор системы',
    status: 'processing',
    createdAt: '2026-05-11T11:00:00Z',
    comment: 'Замена в рамках ППР'
  },
  {
    id: 'm-3',
    itemName: 'Масло редукторное Mobilgear 600',
    quantity: 200,
    unit: 'л',
    urgency: 'planned',
    equipmentId: 'eq-12', // Мельница
    ticketId: null,
    authorName: 'Иван Механик',
    status: 'in_stock',
    createdAt: '2026-05-01T10:00:00Z',
    comment: 'Пополнение запасов цеха измельчения'
  }
];

export const MOCK_KNOWLEDGE = [
  {
    id: 'kb-1',
    title: 'Инструкция по замене роликов конвейера',
    category: 'Механика',
    authorName: 'Иван Механик',
    date: '2026-05-10T14:30:00Z',
    content: 'Перед началом работ обязательно обесточить привод. Снять защитные кожухи. Ослабить натяжение ленты с помощью натяжной станции. Проверить посадочные места подшипников на износ. При установке нового ролика убедиться в отсутствии перекоса. После установки провести пробный пуск без нагрузки.',
    attachments: [{ name: 'Схема_роликоопоры.pdf', size: '2.4 MB' }],
    equipmentId: 'eq-6' // Конвейер 102
  },
  {
    id: 'kb-2',
    title: 'Электрическая схема питания дробилки',
    category: 'Электрика',
    authorName: 'Петр Электрик',
    date: '2026-05-09T09:15:00Z',
    content: 'В приложении находится актуальная однолинейная схема подключения дробилки №1. Внимание: внесены изменения в цепь управления блокировками. Реле K1 и K2 заменены на новые модели с задержкой времени.',
    attachments: [{ name: 'Однолинейная_схема.pdf', size: '1.1 MB' }, { name: 'Фото_щитка.jpg', size: '4.5 MB' }],
    equipmentId: 'eq-3'
  },
  {
    id: 'kb-3',
    title: 'Регламент ТО маслостанции',
    category: 'Гидравлика',
    authorName: 'Администратор системы',
    date: '2026-05-01T10:00:00Z',
    content: 'Замена фильтров тонкой очистки производится каждые 500 моточасов. Марка фильтра: Parker 10G. Контроль уровня масла в баке - ежедневно. При падении давления ниже 1.5 бар немедленно остановить работу насоса и проверить магистраль на утечки.',
    attachments: [],
    equipmentId: null
  }
];
