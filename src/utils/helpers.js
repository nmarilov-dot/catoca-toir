import { parseISO, isValid } from 'date-fns';
import { MOCK_EQUIPMENT } from '../api/mockData';

/**
 * Получить имя оборудования по его ID
 */
export const getEquipmentName = (id) => {
  return MOCK_EQUIPMENT.find(e => e.id === id)?.name || 'Неизвестно';
};

/**
 * Безопасный парсинг даты из строки ISO
 */
export const safeParseISO = (dateStr) => {
  if (!dateStr) return new Date();
  const date = parseISO(dateStr);
  return isValid(date) ? date : new Date();
};

/**
 * Группировка массива по ключу
 */
export const groupBy = (array, key) => {
  return array.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
};
