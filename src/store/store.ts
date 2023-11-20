import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
      coffeList: CoffeeData,
      beansList: BeansData,
      cartPrice: 0,
      cartList: [],
      orderHistory: [],
      favouriteList: [],
      addToCart: (cartItem: any) =>
        set(
          produce(state => {
            let found: boolean = false;
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id === cartItem.id) {
                found = true;
                let size = false;
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (
                    state.cartList[i].prices[j].size === cartItem.prices[0].size
                  ) {
                    size = true;
                    state.cartList[i].prices[j].quantity++;
                    break;
                  }
                }
                if (size === false) {
                  state.cartList[i].prices.push(cartItem.prices[0]);
                }
                state.cartList[i].prices.sort((a: any, b: any) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }
                  return 0;
                });
                break;
              }
            }
            if (found === false) {
              state.cartList.push(cartItem);
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce(state => {
            let totalPrice = 0;
            for (let i = 0; i < state.cartList.length; i++) {
              let tempPrice = 0;
              for (let j = 0; j < state.cartList[i].prices.length; j++) {
                tempPrice =
                  tempPrice +
                  parseFloat(state.cartList[i].prices[j].price) *
                    state.cartList[i].prices[j].quantity;
              }
              state.cartList[i].itemPrice = tempPrice.toFixed(2).toString();
              totalPrice = totalPrice + tempPrice;
            }
            state.cartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavouriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type === 'Coffee') {
              for (let i = 0; i < state.coffeList.length; i++) {
                if (state.coffeList[i].id === id) {
                  if (state.coffeList[i].favourite === false) {
                    state.coffeList[i].favourite = true;
                    state.favouriteList.unshift(state.coffeList[i]);
                  }
                  break;
                }
              }
            } else if (type === 'Bean') {
              for (let i = 0; i < state.beansList.length; i++) {
                if (state.beansList[i].id === id) {
                  if (state.beansList[i].favourite === false) {
                    state.beansList[i].favourite = true;
                    state.favouriteList.unshift(state.beansList[i]);
                  }
                  break;
                }
              }
            }
          }),
        ),
      deleteFromFavouriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type === 'Coffee') {
              for (let i = 0; i < state.coffeList.length; i++) {
                if (state.coffeList[i].id === id) {
                  if (state.coffeList[i].favourite === true) {
                    state.coffeList[i].favourite = false;
                  }
                  break;
                }
              }
            } else if (type === 'Bean') {
              for (let i = 0; i < state.beansList.length; i++) {
                if (state.beansList[i].id === id) {
                  if (state.beansList[i].favourite === true) {
                    state.beansList[i].favourite = false;
                  }
                  break;
                }
              }
            }
            let spliceIndex = -1;
            for (let i = 0; i < state.favouriteList.length; i++) {
              if (state.favouriteList[i].id === id) {
                spliceIndex = 1;
                break;
              }
            }
            state.favouriteList.splice(spliceIndex, 1);
          }),
        ),
      incrementCartQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id === id) {
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (state.cartList[i].prices[j].size === size) {
                    state.cartList[i].prices[j].quantity++;
                    break;
                  }
                }
              }
            }
          }),
        ),
      decrementCartQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id === id) {
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (state.cartList[i].prices[j].size === size) {
                    if (state.cartList[i].prices.length > 1) {
                      if (state.cartList[i].prices[j].quantity > 1) {
                        state.cartList[i].prices[j].quantity--;
                      } else {
                        state.cartList[i].prices.splice(j, 1);
                      }
                    } else {
                      if (state.cartList[i].prices[j].quantity > 1) {
                        state.cartList[i].prices[j].quantity--;
                      } else {
                        state.cartList.splice(i, 1);
                      }
                    }
                    break;
                  }
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCart: () =>
        set(
          produce(state => {
            let temp = state.cartList.reduce(
              (accumulator: number, currentvalue: any) =>
                accumulator + parseFloat(currentvalue.itemPrice),
              0,
            );
            if (state.orderHistory.length > 0) {
              state.orderHistory.unshift({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                CartList: state.cartList,
                CartListPrice: temp.toFixed(2).toString(),
              });
            } else {
              state.orderHistory.push({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                CartList: state.cartList,
                CartListPrice: temp.toFixed(2).toString(),
              });
            }
            state.cartList = [];
          }),
        ),
    }),
    {
      name: 'coffe-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
