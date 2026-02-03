/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import { Colors } from '../../../assets/colors';
import { getPetProfile } from '../../../GlobalFunctions/Auth';
import { ImageBaseUrl } from '../../../BaseUrl';
import moment from 'moment';

// Define types for FlatList data
interface BehaviorItem {
    id: number;
    name: string;
}

const PetProfile: React.FC = ({ navigation, route }) => {
    const behaviorData: BehaviorItem[] = [
        { id: 1, name: 'Leash trained' },
        { id: 2, name: 'Friendly with cats' },
        { id: 3, name: 'Active' },
        { id: 4, name: 'Tries to eat things' }, // Changed id to 4 (no duplicate)
    ];
    const [data, setData] = useState();
    // const {petName,petImages,weight,height,description,dob,breed,behaviour,color,profileImage,specialCareNeed,size} = data;
    // console.log('data',petName,petImages,weight,height,description,dob,breed,behaviour,color,profileImage,specialCareNeed,size)
    const { _id } = route?.params;
    console.log('_id', _id)
    console.log('data.dob', data?.dob)
    const getPetProfileHandler = async () => {
        const response = await getPetProfile(_id);
        setData(response.data)
        console.log('respomnses====>>>><<<<<', response);
    }
    useEffect(() => {
        getPetProfileHandler();
    }, [])
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: Colors.white,
                paddingBottom: responsiveHeight(2),
            }}>
            <View>
                <Image source={{ uri: `${ImageBaseUrl}${data?.profileImage}` }} style={{ height: responsiveHeight(40), width: responsiveWidth(100) }} />

                <View
                    style={{
                        padding: 20,
                        width: responsiveWidth(90),
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: responsiveHeight(-6),
                    }}>
                    <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 10,
                        }}
                        blurType="light"
                        blurAmount={30}
                        reducedTransparencyFallbackColor="black"
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <View>
                            <Text style={{ color: Colors.themeText, fontSize: responsiveFontSize(3), fontWeight: '900' }}>{data?.petName}</Text>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#A6A6A6' }}>
                                {data?.breed}{' '}
                                {(() => {
                                    const now = moment();
                                    const birth = moment(data?.dob);
                                    const years = now.diff(birth, 'years');
                                    birth.add(years, 'years');
                                    const months = now.diff(birth, 'months');
                                    return `${years}y ${months}m`;
                                })()}
                            </Text>                        </View>
                        <Image source={images.female} />
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', width: responsiveWidth(90), alignSelf: 'center', gap: 10, marginTop: responsiveHeight(8) }}>
                <Image source={images.paw} style={{ height: responsiveHeight(4), width: responsiveHeight(4) }} />
                <Text style={{ color: Colors.themeText, fontSize: responsiveFontSize(3.5), fontWeight: '900' }}>About {data?.petName}</Text>
            </View>

            <FlatList
                data={[
                    {
                        result: data?.weight ? `${data.weight} kg` : '',
                        title: 'Weight',
                    },
                    {
                        result: data?.height ? `${data.height} cm` : '',
                        title: 'Height',
                    },
                    {
                        result: data?.color || '',
                        title: 'Color',
                    },
                ]}
                contentContainerStyle={{ width: responsiveWidth(90), alignSelf: 'center', marginTop: 20 }}
                horizontal
                keyExtractor={(item, index) => index.toString()} // Added keyExtractor
                renderItem={({ item }) => {
                    return (
                        <View style={{ padding: 20, width: responsiveWidth(30), borderWidth: 0.5, borderRadius: 10, marginLeft: 10, gap: 5 }}>
                            <Text style={{ color: '#A6A6A6', fontSize: responsiveFontSize(2) }}>{item?.title}</Text>
                            <Text style={{ color: Colors.buttonBg, fontSize: responsiveFontSize(3), fontWeight: 'bold' }}>{item.result}</Text>
                        </View>
                    );
                }}
            />

            <Text style={{ width: responsiveWidth(90), alignSelf: 'center', marginTop: 20, fontSize: responsiveFontSize(2), color: '#A6A6A6' }}>
                {data?.description}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', width: responsiveWidth(90), alignSelf: 'center', gap: 10, marginTop: 10 }}>
                <Image source={images.smileys} style={{ height: responsiveHeight(4), width: responsiveHeight(4) }} />
                <Text style={{ color: Colors.themeText, fontSize: responsiveFontSize(3.5), fontWeight: '900' }}>{data?.petName} behavior</Text>
            </View>

            <FlatList
                data={data?.behaviour}
                contentContainerStyle={{ width: responsiveWidth(90), alignSelf: 'center', marginTop: 20, flexWrap: 'wrap', gap: 10 }}
                horizontal
                // keyExtractor={(item) => item.id.toString()} // Ensure unique keys
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{
                                padding: 10,
                                paddingHorizontal: 20,
                                borderWidth: 1.5,
                                borderRadius: 1000,
                                marginLeft: 10,
                                gap: 5,
                                borderColor: Colors.buttonBg,
                            }}>
                            <Text style={{ color: '#A6A6A6', fontSize: responsiveFontSize(2) }}>{item}</Text>
                        </View>
                    );
                }}
            />

            {/* <View style={{ flexDirection: 'row', alignSelf: 'center', width: responsiveWidth(90), marginTop: 20, justifyContent: 'space-between' }}>
                <Image source={images.dog1} style={{ width: responsiveWidth(44), height: responsiveHeight(15), borderRadius: 10, overflow: 'hidden' }} />
                <Image source={images.dog2} style={{ width: responsiveWidth(44), height: responsiveHeight(15), borderRadius: 10, overflow: 'hidden' }} />
            </View>

            <Image
                source={images.dog3}
                style={{
                    width: responsiveWidth(90),
                    height: responsiveHeight(15),
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignSelf: 'center',
                    marginTop: 10,
                }}
            /> */}



            <View style={{ marginTop: 20 }}>
                {data?.petImages?.map((_, index) => {
                    if (index % 2 === 0) {
                        const firstImage = data?.petImages[index];
                        const secondImage = data?.petImages[index + 1];

                        if (secondImage) {
                            // Render two side-by-side
                            return (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: responsiveWidth(90),
                                        alignSelf: 'center',
                                        marginBottom: 10,
                                    }}>
                                    <Image
                                        source={{ uri: `${ImageBaseUrl}${firstImage}` }}
                                        style={{
                                            width: responsiveWidth(44),
                                            height: responsiveHeight(15),
                                            borderRadius: 10,
                                        }}
                                    />
                                    <Image
                                        source={{ uri: `${ImageBaseUrl}${secondImage}` }}
                                        style={{
                                            width: responsiveWidth(44),
                                            height: responsiveHeight(15),
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            );
                        } else {
                            // Only one image left (odd number), render full width
                            return (
                                <Image
                                    key={index}
                                    source={{ uri: `${ImageBaseUrl}${firstImage}` }}
                                    style={{
                                        width: responsiveWidth(90),
                                        height: responsiveHeight(15),
                                        borderRadius: 10,
                                        alignSelf: 'center',
                                        marginBottom: 10,
                                    }}
                                />
                            );
                        }
                    } else {
                        return null; // skip odd indexes (handled in even index check)
                    }
                })}
            </View>
        </ScrollView>
    );
};

export default PetProfile;
