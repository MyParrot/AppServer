import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, Text } from 'react-native';

const images = [
  'https://images.unsplash.com/photo-1726064855836-6042eb0bc5da?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

export default function AlbumScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const numColumns = 3;

  const openModal = (uri: string) => {
    setSelectedUri(uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUri(null);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.thumbContainer}
      onPress={() => openModal(item)}
      accessibilityLabel="사진 크게 보기"
    >
      <Image source={{ uri: item }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images.sort((a, b) => 0)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeArea} onPress={closeModal} />
          {selectedUri && (
            <Image source={{ uri: selectedUri }} style={styles.fullImage} />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');
const thumbSize = width / 3 - 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 2,
  },
  thumbContainer: {
    margin: 2,
  },
  thumbnail: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});