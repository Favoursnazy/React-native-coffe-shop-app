import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import CartItem from '../components/CartItem';

const CartScreen = ({navigation, route}: any) => {
  const cartList = useStore((state: any) => state.cartList);
  const CartPrice = useStore((state: any) => state.cartPrice);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const incrementCartQuantity = useStore(
    (state: any) => state.incrementCartQuantity,
  );
  const decrementCartQuantity = useStore(
    (state: any) => state.decrementCartQuantity,
  );
  const tabarHeight = useBottomTabBarHeight();

  // Payment Handler
  const PaymentButtonHandler = () => {
    navigation.navigate('Payment', {
      amount: CartPrice,
    });
  };

  const incrementCartQtyHandler = (id: string, size: string) => {
    incrementCartQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartQtyHandler = (id: string, size: string) => {
    decrementCartQuantity(id, size);
    calculateCartPrice();
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[
            styles.ScrollViewInnerView,
            {
              marginBottom: tabarHeight,
            },
          ]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Cart" />
            {cartList.length === 0 ? (
              <EmptyListAnimation title="Cart is Empty" />
            ) : (
              <View style={styles.ListItemContainer}>
                {cartList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <CartItem
                      id={data.id}
                      name={data.name}
                      roasted={data.roasted}
                      type={data.type}
                      prices={data.prices}
                      incrementCartQtyHandler={incrementCartQtyHandler}
                      decrementCartQtyHandler={decrementCartQtyHandler}
                      imagelink_square={data.imagelink_square}
                      special_ingredient={data.special_ingredient}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {cartList.length != 0 ? (
            <PaymentFooter
              buttonTitle="Pay"
              price={{price: CartPrice, currency: '$'}}
              buttonPressHandler={PaymentButtonHandler}
            />
          ) : (
            ''
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});

export default CartScreen;
