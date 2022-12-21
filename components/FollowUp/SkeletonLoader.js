import {View} from 'react-native';
import React from 'react';
import {VStack, HStack, Skeleton} from 'native-base';
import {COLORS, SIZES} from '../../constants';

export const PatronSkeleton = props => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {Array(3)
        .fill('😎')
        .map((item, index) => (
          <VStack
            mt={index === 0 ? SIZES.paddingSmall : 0}
            key={index}
            space="3"
            w={SIZES.width * 0.9}
            alignSelf="center"
            p={SIZES.paddingSmall}
            mb={SIZES.paddingMedium}
            bgColor={COLORS.white}
            borderRadius={SIZES.radiusSmall}>
            <VStack position={'relative'}>
              <HStack
                space={'2'}
                position={'absolute'}
                top={SIZES.fontScale * 2}
                left={SIZES.fontScale * 2}>
                <Skeleton
                  size="50"
                  rounded="full"
                  endColor={'rgba(0,0,0,0.4)'}
                />
                <Skeleton
                  h={'4'}
                  w={'1/2'}
                  borderRadius={SIZES.radiusSmall}
                  endColor={'rgba(0,0,0,0.4)'}
                />
              </HStack>
              <Skeleton
                h={'20'}
                borderRadius={SIZES.radiusSmall}
                endColor={'#599D5570'}
              />

              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 5}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 20}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack
              space="5"
              justifyContent={'space-evenly'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="2/4"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack
              space="5"
              justifyContent={'space-evenly'}
              mx="2"
              pb="2"
              mt="1"
              borderBottomWidth="0.5"
              borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
              <Skeleton
                h={5}
                w={'2/3'}
                borderRadius={SIZES.radiusSmall}
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                size={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                endColor={'rgba(0,0,0,0.4)'}
                rounded={'full'}
              />
            </HStack>
          </VStack>
        ))}
    </View>
  );
};

export const DonorSkeleton = props => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {Array(2)
        .fill('😎')
        .map((item, index) => (
          <VStack
            mt={index === 0 ? SIZES.paddingSmall : 0}
            key={index}
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
                endColor={'#599D5570'}
              />
              <Skeleton
                h={'1/3'}
                w={'1/3'}
                borderRadius={SIZES.radiusSmall}
                position={'absolute'}
                top={SIZES.fontScale * 2}
                left={SIZES.fontScale * 2}
                endColor={'rgba(0,0,0,0.4)'}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 5}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 20}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack space="5" justifyContent={'center'} mx="2" pb="2" mt="1">
              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack
              space="5"
              mx="2"
              pb="2"
              mt="1"
              borderBottomWidth="0.5"
              borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
              <Skeleton
                h={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/3"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/2"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack
              space="5"
              mx="2"
              pb="2"
              mt="1"
              borderBottomWidth="0.5"
              borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
              <Skeleton
                h={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/3"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/2"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                size={'5'}
                rounded={'full'}
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>
          </VStack>
        ))}
    </View>
  );
};

export const PropspectSkeleton = props => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {Array(4)
        .fill('😎')
        .map((item, index) => (
          <VStack
            mt={index === 0 ? SIZES.paddingSmall : 0}
            key={index}
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
                endColor={'#599D5570'}
              />
              <Skeleton
                h={'1/3'}
                w={'1/3'}
                borderRadius={SIZES.radiusSmall}
                position={'absolute'}
                top={SIZES.fontScale * 2}
                left={SIZES.fontScale * 2}
                endColor={'rgba(0,0,0,0.4)'}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 5}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 20}
              />
              <Skeleton
                size="5"
                borderRadius={SIZES.radiusSmall}
                rounded="full"
                alignSelf={'center'}
                endColor={'rgba(0,0,0,0.4)'}
                position={'absolute'}
                bottom={SIZES.fontScale * 2}
                right={SIZES.fontScale * 50}
              />
            </VStack>

            <HStack
              space="5"
              justifyContent={'space-between'}
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
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="2/4"
                endColor={'rgba(0,0,0,0.4)'}
              />
            </HStack>

            <HStack
              space="5"
              justifyContent={'space-around'}
              mx="2"
              pb="2"
              mt="1">
              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="1/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                h={3}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                w="2/4"
                endColor={'rgba(0,0,0,0.4)'}
              />

              <Skeleton
                size={'5'}
                borderRadius={SIZES.radiusSmall}
                my={0.5}
                endColor={'rgba(0,0,0,0.4)'}
                rounded={'full'}
              />
            </HStack>
          </VStack>
        ))}
    </View>
  );
};
