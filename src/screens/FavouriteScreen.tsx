import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import FavouriteItemCard from '../components/FavouriteItemCard';

const FavouriteScreen = ({navigation}: any) => {
  const FavouriteList = useStore((state: any) => state.favouriteList);
  const addToFavouriteList = useStore((state: any) => state.addToFavouriteList);
  const deleteFromFavouriteList = useStore(
    (state: any) => state.deleteFromFavouriteList,
  );
  // Toggle favourite
  const ToggleFavourite = (favourite: boolean, type: string, id: string) => {
    favourite
      ? deleteFromFavouriteList(type, id)
      : addToFavouriteList(type, id);
  };
  const tarBarHeight = useBottomTabBarHeight();
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
              marginBottom: tarBarHeight,
            },
          ]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Favourites" />
            {FavouriteList.length === 0 ? (
              <EmptyListAnimation title="No Favourites" />
            ) : (
              <View style={styles.ListItemContainer}>
                {FavouriteList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <FavouriteItemCard
                      id={data.id}
                      imagelink_portrait={data.imagelink_portrait}
                      name={data.name}
                      special_ingredient={data.special_ingredient}
                      type={data.type}
                      ingredients={data.ingredients}
                      average_rating={data.average_rating}
                      ratings_count={data.ratings_count}
                      roasted={data.roasted}
                      description={data.description}
                      favourite={data.favourite}
                      toggleFavouriteItem={ToggleFavourite}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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

export default FavouriteScreen;
