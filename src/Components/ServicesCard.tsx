import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { images } from "../assets/images";
import { Colors } from "../assets/colors";
import { responsiveHeight } from "../assets/responsive_dimensions";
import { ImageBaseUrl } from "../BaseUrl";


interface ServiceCardProps {
  title: string;
  price: string;
  frequency: string;
  imageUrl: any;
  selected: boolean;
  cardStyle: ViewStyle;
  onPress: () => void;
  onCardPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  price,
  frequency,
  cardStyle,
  imageUrl,
  selected,
  onCardPress,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onCardPress}>
      <Image source={{ uri: `${ImageBaseUrl}${imageUrl}` }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{frequency}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.radioButton}>
          <View style={styles.circleBorder}>
            {selected && <View style={styles.circle} />}
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    marginBottom: 10,
  },
  image: {
    width: responsiveHeight(12),
    height: responsiveHeight(12),
    borderRadius: 10,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  price: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 4,
  },
  tag: {
    marginTop: 4,
    borderWidth: 0.5,
    borderColor: Colors.black,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 12,
    color: "#4B5563",
  },
  radioButton: {
    marginLeft: 12,
  },
  circleBorder: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
  circle: {
    borderRadius: 100,
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(2),
    width: responsiveHeight(2.),
  }
});

export default ServiceCard;
