import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {VStack, HStack, Skeleton, Spinner} from 'native-base';
import {SIZES, COLORS, SHADOW} from '../../constants';

const DonorCardSkeleton = () => {
  return (
    <VStack
      space="3"
      w={SIZES.width * 0.9}
      alignSelf="center"
      p={SIZES.paddingSmall}
      mb={SIZES.paddingMedium}
      bgColor={COLORS.white}
      borderRadius={SIZES.radiusSmall}>
      <VStack position={'relative'}>
        <Skeleton
          h={'20'}
          borderRadius={SIZES.radiusSmall}
          endColor={COLORS.activeGreen + 80}
        />
        <Skeleton
          h={'1/3'}
          w={'1/3'}
          borderRadius={SIZES.radiusSmall}
          position={'absolute'}
          top={SIZES.fontScale * 2}
          left={SIZES.fontScale * 2}
          endColor={COLORS.black}
        />
        <Skeleton
          size="5"
          borderRadius={SIZES.radiusSmall}
          rounded="full"
          alignSelf={'center'}
          endColor={COLORS.black}
          position={'absolute'}
          bottom={SIZES.fontScale * 2}
          right={SIZES.fontScale * 5}
        />
        <Skeleton
          size="5"
          borderRadius={SIZES.radiusSmall}
          rounded="full"
          alignSelf={'center'}
          endColor={COLORS.black}
          position={'absolute'}
          bottom={SIZES.fontScale * 2}
          right={SIZES.fontScale * 20}
        />
        <Skeleton
          size="5"
          borderRadius={SIZES.radiusSmall}
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
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />
      </HStack>

      <HStack
        space="5"
        justifyContent={'center'}
        mx="2"
        pb="2"
        mt="1"
        borderBottomWidth="0.5"
        borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
        <Skeleton
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />

        <Skeleton
          h={3}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/4"
          endColor={COLORS.black}
        />
      </HStack>
      <Skeleton
        h={5}
        w={'2/3'}
        borderRadius={SIZES.radiusSmall}
        endColor={COLORS.black}
        alignSelf={'center'}
      />
    </VStack>
  );
};

export default DonorCardSkeleton;

const styles = StyleSheet.create({});
