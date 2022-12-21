import {StyleSheet} from 'react-native';
import React from 'react';
import {VStack, HStack, Skeleton} from 'native-base';
import {SIZES, COLORS, SHADOW} from '../../constants';

const PatronCardSkeleton = () => {
  return (
    <VStack
      space={SIZES.paddingSmall}
      w={SIZES.width * 0.9}
      p={SIZES.paddingSmall}
      mb={SIZES.paddingMedium}
      bgColor={COLORS.white}
      borderRadius={SIZES.radiusMedium}>
      <VStack position={'relative'}>
        <HStack
          position={'absolute'}
          top={SIZES.fontScale * 2}
          left={SIZES.fontScale * 2}>
          <Skeleton
            size={SIZES.width * 0.15}
            rounded="full"
            endColor={COLORS.black}
          />
          <Skeleton
            h={'4'}
            w={'1/2'}
            borderRadius={SIZES.radiusSmall}
            endColor={COLORS.black}
          />
        </HStack>
        <Skeleton
          h={'20'}
          borderRadius={SIZES.radiusSmall}
          endColor={COLORS.activeGreen + 80}
        />

        <Skeleton
          size="5"
          rounded="full"
          alignSelf={'center'}
          endColor={COLORS.black}
          position={'absolute'}
          bottom={SIZES.fontScale * 2}
          right={SIZES.fontScale * 4}
        />
        <Skeleton
          size="5"
          rounded="full"
          alignSelf={'center'}
          endColor={COLORS.black}
          position={'absolute'}
          bottom={SIZES.fontScale * 2}
          right={SIZES.fontScale * 50}
        />
      </VStack>

      <HStack
        space="5"
        justifyContent={'center'}
        mx="2"
        pb="2"
        mt="1"
        borderBottomWidth="0.5"
        borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />
      </HStack>

      <HStack space={'20'} justifyContent={'center'}>
        <Skeleton
          size={'5'}
          rounded={'full'}
          endColor={COLORS.black}
          alignSelf={'center'}
        />
        <Skeleton
          size={'5'}
          rounded={'full'}
          endColor={COLORS.black}
          alignSelf={'center'}
        />
        <Skeleton
          size={'5'}
          rounded={'full'}
          endColor={COLORS.black}
          alignSelf={'center'}
        />
      </HStack>
    </VStack>
  );
};

export default PatronCardSkeleton;

const styles = StyleSheet.create({});
