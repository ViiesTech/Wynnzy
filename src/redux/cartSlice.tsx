import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CartItem {
  id: string | number;
  variationId: string | number;
  title: string;
  subTitle: string;
  image: any;
  price: number;
  quantity: number;
  isSelected: boolean;
  store?: string;
  isStore?: boolean;
  isHr?: boolean;
  checkMarkColor?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'isSelected'>>) => {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === action.payload.id &&
          item.variationId === action.payload.variationId,
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push({...action.payload, isSelected: true});
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{
        id: string | number;
        variationId: string | number;
      }>,
    ) => {
      state.items = state.items.filter(
        item =>
          !(
            item.id === action.payload.id &&
            item.variationId === action.payload.variationId
          ),
      );
    },
    increaseQuantity: (
      state,
      action: PayloadAction<{
        id: string | number;
        variationId: string | number;
      }>,
    ) => {
      const item = state.items.find(
        i =>
          i.id === action.payload.id &&
          i.variationId === action.payload.variationId,
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{
        id: string | number;
        variationId: string | number;
      }>,
    ) => {
      const item = state.items.find(
        i =>
          i.id === action.payload.id &&
          i.variationId === action.payload.variationId,
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    toggleItemSelection: (
      state,
      action: PayloadAction<{
        id: string | number;
        variationId: string | number;
      }>,
    ) => {
      const item = state.items.find(
        i =>
          i.id === action.payload.id &&
          i.variationId === action.payload.variationId,
      );
      if (item) {
        item.isSelected = !item.isSelected;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  toggleItemSelection,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
