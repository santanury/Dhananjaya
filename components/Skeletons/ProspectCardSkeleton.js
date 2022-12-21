import {StyleSheet} from 'react-native';
import React from 'react';
import {VStack, HStack, Skeleton} from 'native-base';
import {SIZES, COLORS, SHADOW} from '../../constants';

const ProspectCardSkeleton = () => {
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
          h={'4'}
          w={'1/2'}
          borderRadius={SIZES.radiusSmall}
          endColor={COLORS.black}
          position={'absolute'}
          top={SIZES.fontScale * 2}
          left={SIZES.fontScale * 2}
        />
        <Skeleton
          h={'4'}
          w={'1/4'}
          borderRadius={SIZES.radiusSmall}
          endColor={COLORS.black}
          position={'absolute'}
          top={SIZES.fontScale * 8}
          left={SIZES.fontScale * 2}
        />
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
      </VStack>

      <HStack
        space="5"
        mx="2"
        pb="2"
        mt="1"
        borderBottomWidth="0.5"
        borderBottomColor={COLORS.black + 10}>
        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/3"
          endColor={COLORS.black}
        />

        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/2"
          endColor={COLORS.black}
        />
      </HStack>

      <HStack
        space="5"
        mx="2"
        pb="2"
        mt="1"
        borderBottomWidth="0.5"
        borderBottomColor={COLORS.black + 10}>
        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/3"
          endColor={COLORS.black}
        />

        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/2"
          endColor={COLORS.black}
        />
      </HStack>

      <HStack
        space="5"
        mx="2"
        pb="2"
        mt="1"
        borderBottomWidth="0.5"
        borderBottomColor={COLORS.black + 10}>
        <Skeleton
          h={'5'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/3"
          endColor={COLORS.black}
        />

        <Skeleton
          h={'20'}
          borderRadius={SIZES.radiusSmall}
          my={0.5}
          w="1/2"
          endColor={COLORS.black}
        />

        <Skeleton size={'5'} rounded={'full'} endColor={COLORS.black} />
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

export default ProspectCardSkeleton;

const styles = StyleSheet.create({});
