const initialState = {
  incomeList: [],
  expenseList: [],
};

const AccountingReducer = (state = initialState, action) => {
  // console.log("reducer", action);
  switch (action.type) {
    case "INCOME":
      return {
        incomeList: action.payload,
        expenseList: state.expenseList,
      };

    case "EXPENSE":
      return {
        incomeList: state.incomeList,
        expenseList: action.payload,
      };
    case "REMOVE":
      return {
        incomeList: [
          ...state.incomeList.filter((item) => item.id !== action.payload),
        ],
        expenseList: [
          ...state.expenseList.filter((item) => item.id !== action.payload),
        ],
      };

    default:
      return state;
  }
};

export default AccountingReducer;
