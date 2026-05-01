import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from '../../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import UserHeader from '../../../Components/UserHeader';
import {NormalText} from '../../../Components/Titles';
import {Button} from '../../../Components/Button';
import PickerCard from '../../../Components/PickerCard';
import SvgIcons from '../../../Components/SvgIcons';
import {upload3, cut} from '../../../assets/icons';
import {
  createService,
  updateService,
  getAllCategories,
  selectImageFromGallery,
} from '../../../GlobalFunctions';
import {ShowToast} from '../../../GlobalFunctions/Auth';
import FastImage from 'react-native-fast-image';
import {ImageBaseUrl} from '../../../BaseUrl';

const CreateService = ({navigation, route}: any) => {
  const {serviceData} = route.params || {};
  const isEditMode = !!serviceData;

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [serviceImages, setServiceImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
  });

  const userData = useSelector((state: any) => state.user?.userData);
  const managerId =
    userData?._id || userData?.id || userData?.user?._id || userData?.user?.id;

  useEffect(() => {
    fetchCategories();
  }, [managerId]);

  useEffect(() => {
    if (isEditMode && serviceData) {
      setForm({
        name: serviceData.serviceName || '',
        description: serviceData.description || '',
        price: serviceData.price?.toString() || '',
      });
      setSelectedCategory(
        serviceData.serviceCategory?._id || serviceData.serviceCategory || null,
      );
      if (serviceData.images) {
        // Prepend base URL for display, but keep track if they are local or remote
        const formattedImages = serviceData.images.map((img: string) =>
          img.startsWith('http') ? img : `${ImageBaseUrl}${img}`,
        );
        setServiceImages(formattedImages);
      }
    }
  }, [isEditMode, serviceData]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response?.success) {
        const formatted = response.data.map((cat: any) => ({
          id: cat._id,
          label: cat.categoryName,
          value: cat._id,
        }));
        setCategories(formatted);
      }
    } catch (err) {
      console.log('Error fetching categories:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const pickImage = async () => {
    try {
      const result = await selectImageFromGallery(5);
      if (result) {
        const uris = Array.isArray(result) ? result : [result];
        setServiceImages(prev => {
          // Merge new URIs, but skip duplicates
          const uniqueNewUris = uris.filter(uri => !prev.includes(uri));
          return [...prev, ...uniqueNewUris].slice(0, 5);
        });
      }
    } catch (err) {
      console.log('Error picking image:', err);
    }
  };

  const removeImage = (index: number) => {
    setServiceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !selectedCategory ||
      serviceImages.length === 0
    ) {
      return ShowToast(
        'error',
        'All fields and at least one image are required',
      );
    }

    setIsLoading(true);
    let payload: any = {
      name: form.name,
      description: form.description,
      price: form.price,
      categoryId: selectedCategory,
      managerId: managerId,
      images: serviceImages,
    };

    if (isEditMode) {
      payload.serviceId = serviceData._id;
    }

    console.log('Payload:-', JSON.stringify(payload, null, 2));
    try {
      const response = isEditMode
        ? await updateService(payload)
        : await createService(payload);

      if (response?.success) {
        navigation.goBack();
      }
    } catch (err) {
      console.log(
        `Error ${isEditMode ? 'updating' : 'creating'} service:`,
        err,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof typeof form,
    placeholder: string,
    multiline = false,
    keyboardType: any = 'default',
  ) => {
    return (
      <View style={[styles.inputContainer, styles.shadow]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          value={form[field]}
          onChangeText={text => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor={'#A6A6A6'}
          multiline={multiline}
          keyboardType={keyboardType}
          scrollEnabled={!multiline}
          autoCapitalize={multiline ? 'sentences' : 'words'}
          textAlignVertical={multiline ? 'top' : 'center'}
          textContentType="none"
          importantForAutofill="no"
          autoCorrect={false}
          style={[
            styles.inputStyle,
            multiline && {height: responsiveHeight(12)},
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader
        backIcon={true}
        navigation={navigation}
        title={isEditMode ? 'Edit Service' : 'Create Service'}
        centerText={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {renderInputField('Service Name', 'name', 'e.g. Dog Walk')}

          <View style={[styles.pickerWrapper, styles.shadow]}>
            <Text style={styles.inputLabel}>Category</Text>
            <PickerCard
              multiple={false}
              items={categories}
              setItems={setCategories}
              value={selectedCategory}
              setValue={setSelectedCategory}
              placeHolder="Select Category"
              mrgnTop={5}
            />
          </View>

          {renderInputField('Price ($)', 'price', '0.00', false, 'numeric')}

          {renderInputField(
            'Description',
            'description',
            'Describe the service...',
            true,
          )}

          <View style={styles.imageSection}>
            <ListHeading title="Service Images" showSeeAll={false} />

            <FlatList
              horizontal
              data={serviceImages}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageList}
              renderItem={({item, index}) => (
                <View style={styles.imageWrapper}>
                  <FastImage
                    source={{uri: item}}
                    style={styles.previewImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={styles.removeIcon}>
                    <SvgIcons xml={cut} height={12} width={12} />
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={
                serviceImages.length < 5 ? (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.uploadBtn}>
                    <SvgIcons xml={upload3} height={24} width={24} />
                    <Text style={styles.uploadText}>Add</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isEditMode ? 'Update Service' : 'Create Service'}
              isLoading={isLoading}
              bgColor={Colors.buttonBg}
              handlePress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Sub-component for heading similarity
const ListHeading = ({title, showSeeAll}: any) => (
  <View style={styles.headingRow}>
    <Text style={styles.headingText}>{title}</Text>
    {showSeeAll && <Text style={styles.seeAllText}>See All</Text>}
  </View>
);

export default CreateService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: responsiveHeight(5),
  },
  formContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    gap: responsiveHeight(2),
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {elevation: 3},
    }),
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#2A1F51',
    fontWeight: '700',
  },
  inputStyle: {
    color: '#2A1F51',
    fontSize: responsiveFontSize(1.8),
    marginTop: 5,
    padding: 0,
  },
  pickerWrapper: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    zIndex: 2000,
  },
  imageSection: {
    marginTop: responsiveHeight(1),
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headingText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#2A1F51',
  },
  seeAllText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.buttonBg,
    fontWeight: '600',
  },
  imageList: {
    gap: 12,
    paddingVertical: 5,
  },
  imageWrapper: {
    position: 'relative',
  },
  previewImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  uploadBtn: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#DDE1FF',
    backgroundColor: '#F9FAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: responsiveFontSize(1.6),
    color: '#3B4B68',
    fontWeight: '600',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: responsiveHeight(2),
  },
});
