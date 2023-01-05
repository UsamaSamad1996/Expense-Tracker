export const addIncome = (object) => {
  return {
    type: "INCOME",
    payload: object,
  };
};

export const addExpense = (object) => {
  return {
    type: "EXPENSE",
    payload: object,
  };
};
export const handleDelete = (id) => {
  return {
    type: "REMOVE",
    payload: id,
  };
};
