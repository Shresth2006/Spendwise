import * as React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CarouselProps = {
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  style?: ViewStyle;
};

type CarouselContextProps = {
  orientation: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  flatListRef: React.RefObject<FlatList<any> | null>;
  itemWidth: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setTotalItems: (count: number) => void;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within <Carousel />");
  return context;
}

function Carousel({
  orientation = "horizontal",
  children,
  style,
}: CarouselProps) {
  const flatListRef = React.useRef<FlatList<any> | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  // itemWidth is screen width minus total horizontal padding (24 * 2)
  const itemWidth = SCREEN_WIDTH - 48;

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= totalItems) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const scrollPrev = () => scrollToIndex(currentIndex - 1);
  const scrollNext = () => scrollToIndex(currentIndex + 1);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = orientation === "horizontal" 
      ? event.nativeEvent.contentOffset.x 
      : event.nativeEvent.contentOffset.y;
    
    const index = Math.round(offset / itemWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev: currentIndex > 0,
        canScrollNext: currentIndex < totalItems - 1,
        flatListRef,
        itemWidth,
        onScroll,
        setTotalItems,
      }}
    >
      <View style={[styles.relative, style]}>
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { flatListRef, orientation, itemWidth, onScroll, setTotalItems } = useCarousel();
  
  // Convert children to array and filter out nulls/falsy values
  const data = React.Children.toArray(children).filter(Boolean);

  // Update total items count in the parent context
  React.useEffect(() => {
    setTotalItems(data.length);
  }, [data.length]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      horizontal={orientation === "horizontal"}
      renderItem={({ item }) => (
        <View style={{ width: orientation === "horizontal" ? itemWidth : undefined }}>
          {item}
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16} // High frequency scroll tracking
      snapToInterval={itemWidth} // Snaps exactly to item width
      decelerationRate="fast"
      snapToAlignment="start"
      contentContainerStyle={style}
    />
  );
}

function CarouselItem({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.item, style]}>
      {children}
    </View>
  );
}

function CarouselPrevious({ style }: { style?: ViewStyle }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  if (!canScrollPrev) return null;

  return (
    <TouchableOpacity 
      onPress={scrollPrev} 
      style={[styles.navBtn, styles.prevBtn, style]}
      activeOpacity={0.7}
    >
      <ArrowLeft size={18} color="#9333ea" />
    </TouchableOpacity>
  );
}

function CarouselNext({ style }: { style?: ViewStyle }) {
  const { scrollNext, canScrollNext } = useCarousel();
  if (!canScrollNext) return null;

  return (
    <TouchableOpacity 
      onPress={scrollNext} 
      style={[styles.navBtn, styles.nextBtn, style]}
      activeOpacity={0.7}
    >
      <ArrowRight size={18} color="#9333ea" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  relative: { 
    position: "relative", 
    width: "100%" 
  },
  item: { 
    flex: 1, 
    padding: 4 
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  prevBtn: { left: -12 },
  nextBtn: { right: -12 },
});

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };