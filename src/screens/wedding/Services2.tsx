import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { useGlobalAlert } from '@/components/ThemedAlert';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ImageBackground,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');



// Global Color System (Based on User Request)
const COLORS = {
    saffron: '#FF9933',
    gold: '#D4AF37',
    maroon: '#800000',
    ivory: '#FFFFF0',
    textMain: '#800000', // Kumkum Color (Maroon)
    textLight: '#5D4037',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.85)',
    surface: '#FFF8E1', // Very light cream
};

// Data: Services with Suggestion Data
const serviceCategories = [
    {
        id: '1',
        title: 'E-Invites',
        icon: require('../../../assets1/images/invite.jpg'),
        screen: 'routes/einvite',
        suggestions: [
            { id: 's1', title: 'Video Invites', icon: 'videocam-outline' },
            { id: 's2', title: 'Save the Date', icon: 'calendar-outline' },
            { id: 's3', title: 'Caricature', icon: 'happy-outline' },
        ]
    },
    {
        id: '3',
        title: 'Venues',
        icon: require('../../../assets1/images/venue1.jpg'),
        screen: 'routes/wedding-venue',
        suggestions: [
            { id: 's1', title: 'Resorts', icon: 'business-outline' },
            { id: 's2', title: 'Banquet Halls', icon: 'home-outline' },
            { id: 's3', title: 'Lawns', icon: 'leaf-outline' },
        ]
    },
    {
        id: '4',
        title: 'Catering',
        icon: require('../../../assets1/images/Food.jpg'),
        screen: 'routes/food',
        suggestions: [
            { id: 's1', title: 'Buffet', icon: 'restaurant-outline' },
            { id: 's2', title: 'Live Counters', icon: 'flame-outline' },
        ]
    },
    {
        id: '5',
        title: 'Photography',
        icon: require('../../../assets1/images/photo.jpg'),
        screen: 'routes/photography',
        suggestions: [
            { id: 's1', title: 'Candid', icon: 'camera-outline' },
            { id: 's2', title: 'Cinematic', icon: 'film-outline' },
            { id: 's3', title: 'Drone', icon: 'airplane-outline' },
        ]
    },
    {
        id: '6',
        title: 'Decor',
        icon: require('../../../assets1/images/decor.jpg'),
        screen: 'routes/DecorationFloral',
        suggestions: [
            { id: 's1', title: 'Floral', icon: 'rose-outline' },
            { id: 's2', title: 'Themed', icon: 'color-palette-outline' },
        ]
    },
    {
        id: '7',
        title: 'Jewellery',
        icon: require('../../../assets1/images/Jewellery.jpg'),
        screen: 'routes/JewelleryScreen',
        suggestions: [
            { id: 's1', title: 'Bridal Sets', icon: 'diamond-outline' },
            { id: 's2', title: 'Rings', icon: 'radio-button-on-outline' },
        ]
    },
    {
        id: '8',
        title: 'Mehandi',
        icon: require('../../../assets1/images/mehandi.jpg'),
        screen: 'routes/MehandiScreen',
        suggestions: [
            { id: 's1', title: 'Bridal', icon: 'flower-outline' },
            { id: 's2', title: 'Guest', icon: 'people-outline' },
        ]
    },
    {
        id: '9',
        title: 'Makeup',
        icon: require('../../../assets1/images/makeup.jpg'),
        screen: 'routes/MakeupScreen',
        params: { serviceName: 'Bridal Makeup' },
        suggestions: [
            { id: 's1', title: 'HD Makeup', icon: 'brush-outline' },
            { id: 's2', title: 'Airbrush', icon: 'color-wand-outline' },
        ]
    },
    {
        id: '10',
        title: 'Honeymoon',
        icon: require('../../../assets1/images/honeymoon planning.jpg'),
        screen: 'routes/honeymoon',
        suggestions: [
            { id: 's1', title: 'International', icon: 'earth-outline' },
            { id: 's2', title: 'Domestic', icon: 'car-outline' },
        ]
    },
];

const popularSearches = ['Photography', 'E-Invites', 'Catering', 'Venues', 'Makeup', 'Decor'];

// Data: Planning Tools (Saffron, Gold, Maroon Theme)
const planningTools = [
    { id: 't1', title: 'Budget', desc: 'Track expenses', icon: 'wallet-outline', color: '#FFF8E1', iconColor: '#D4AF37' }, // Gold Tint
    { id: 't2', title: 'Guest List', desc: 'Manage invites', icon: 'people-outline', color: '#FFF3E0', iconColor: '#FF9933' }, // Saffron Tint
    { id: 't3', title: 'Checklist', desc: 'Stay organized', icon: 'checkmark-done-circle-outline', color: '#FFEBEE', iconColor: '#800000' }, // Maroon Tint
    { id: 't4', title: 'Inspiration', desc: 'Discover trends', icon: 'bulb-outline', color: '#F3E5F5', iconColor: '#7B1FA2' }, // Purple Tint (Accent)
];

const AnimatedToolCard = ({ tool, onPress }: { tool: any; onPress: any }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={styles.toolCardWrapper}
        >
            <Animated.View style={[styles.toolCard, { backgroundColor: tool.color, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.toolHeader}>
                    <View style={[styles.toolIconContainer, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                        <Ionicons name={tool.icon} size={26} color={tool.iconColor} />
                    </View>
                    <Ionicons name="lock-closed" size={16} color={tool.iconColor} style={{ opacity: 0.8 }} />
                </View>
                <View style={styles.toolTextContainer}>
                    <Text style={[styles.toolTitle, { color: tool.iconColor }]}>{tool.title}</Text>
                    <Text style={styles.toolDesc}>{tool.desc}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// ... inside Services2 component ...

const renderPlanningTools = () => (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wedding Tools</Text>
        </View>
        <View style={styles.toolsGrid}>
            {planningTools.map((tool) => (
                <AnimatedToolCard key={tool.id} tool={tool} onPress={() => { }} />
            ))}
        </View>
    </View>
);

// Floating Animation Component for 3D Icon Effect
// Floating Animation Component for 3D Icon Effect
// Floating Animation Removed



// Data: Recommendations (Updated as per User Request)
const recommendations = [
    { id: 'r1', title: 'E-Invites', subtitle: 'Digital & Animated', image: require('../../../assets1/images/invite.jpg'), screen: 'routes/einvite' },
    { id: 'r3', title: 'Wedding Venue', subtitle: 'Luxury Locations', image: require('../../../assets1/images/venue1.jpg'), screen: 'routes/wedding-venue' },
    { id: 'r4', title: 'Food & Catering', subtitle: 'Gourmet Menu', image: require('../../../assets1/images/Food.jpg'), screen: 'routes/food' },
    { id: 'r5', title: 'Photography', subtitle: 'Capture Moments', image: require('../../../assets1/images/photo.jpg'), screen: 'routes/photography' },
    { id: 'r6', title: 'Honeymoon Planning', subtitle: 'Romantic Getaways', image: require('../../../assets1/images/honeymoon planning.jpg'), screen: 'routes/honeymoon' },
];



const EventManagementUniqueCard = ({ onPress }: { onPress: any }) => {
    const rotateX = useRef(new Animated.Value(0)).current;
    const rotateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1.05, useNativeDriver: true }),
            Animated.spring(rotateY, { toValue: 15, useNativeDriver: true }),
            Animated.spring(rotateX, { toValue: -10, useNativeDriver: true }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(rotateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(rotateX, { toValue: 0, useNativeDriver: true }),
        ]).start();
    };

    const rX = rotateX.interpolate({ inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] });
    const rY = rotateY.interpolate({ inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] });

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.uniqueCardWrapper}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[
                styles.uniqueCard,
                {
                    transform: [
                        { perspective: 1000 },
                        { scale },
                        { rotateX: rX },
                        { rotateY: rY }
                    ]
                }
            ]}>
                <LinearGradient
                    colors={['#800000', '#D4AF37', '#800000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.uniqueCardGradient}
                >
                    <Image
                        source={require('../../../assets1/images/Gust Mangment.jpg')}
                        style={styles.uniqueCardImage}
                    />
                    <View style={styles.uniqueCardContent}>
                        <Ionicons name="lock-closed" size={24} color="#FFD700" style={{ marginBottom: 5 }} />
                        <Text style={styles.uniqueCardTitle}>Event Management</Text>
                        <Text style={styles.uniqueCardTag}>VIP Experience</Text>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const Services2 = () => {
    const navigation = useNavigation<any>();
    const { showAlert } = useGlobalAlert();
    const searchAnim = useRef(new Animated.Value(0)).current;

    // State
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter State
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const filterCategories = ['All', 'Planning', 'Venue', 'Food', 'Fashion', 'Media', 'Decor'];

    // Mapping Services to Categories
    const getCategory = (title: string) => {
        if (['Event Management', 'Honeymoon'].includes(title)) return 'Planning';
        if (['Venues'].includes(title)) return 'Venue';
        if (['Catering'].includes(title)) return 'Food';
        if (['Jewellery', 'Mehandi', 'Makeup'].includes(title)) return 'Fashion';
        if (['Photography', 'E-Invites'].includes(title)) return 'Media';
        if (['Decor'].includes(title)) return 'Decor';
        return 'Other';
    };

    // Countdown & Progress State
    const [configModalVisible, setConfigModalVisible] = useState(false);
    const [weddingDate, setWeddingDate] = useState(new Date()); // Default: Today (0 days left)
    const [bookedServices, setBookedServices] = useState<string[]>([]); // IDs of booked services (Initially zero)

    // Filter Logic
    const filteredServices = serviceCategories.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.suggestions && item.suggestions.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())));

        if (activeCategory === 'All') return matchesSearch;
        return matchesSearch && getCategory(item.title) === activeCategory;
    });

    const filteredRecommendations = recommendations.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollViewRef = useRef(null);

    // Fade In Animation for Tools
    const toolsFadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(toolsFadeAnim, {
            toValue: 1,
            duration: 800,
            delay: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    // Search Animation
    const toggleSearch = () => {
        const toValue = isSearchExpanded ? 0 : 1;
        setIsSearchExpanded(!isSearchExpanded);

        Animated.timing(searchAnim, {
            toValue,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
        }).start();

        if (isSearchExpanded) setSearchQuery('');
    };

    // Modal Handler
    const handleServicePress = (item: any) => {
        showAlert(
            "Coming Soon 🌟",
            `${item.title} is currently under setup. We will make it available very soon for your best experience!`
        );
    };

    const renderConfigModal = () => {
        const toggleService = (id: string) => {
            if (bookedServices.includes(id)) {
                setBookedServices(bookedServices.filter(sId => sId !== id));
            } else {
                setBookedServices([...bookedServices, id]);
            }
        };

        const changeDate = (field: string, value: number) => {
            const newDate = new Date(weddingDate);
            if (field === 'month') newDate.setMonth(newDate.getMonth() + value);
            if (field === 'day') newDate.setDate(newDate.getDate() + value);
            if (field === 'year') newDate.setFullYear(newDate.getFullYear() + value);
            setWeddingDate(newDate);
        };

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={configModalVisible}
                onRequestClose={() => setConfigModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={90} tint="light" style={styles.configModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Setup Wedding Details</Text>
                            <TouchableOpacity onPress={() => setConfigModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.maroon} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Date Picker Section */}
                            <Text style={styles.configSectionTitle}>When is the Big Day?</Text>
                            <View style={styles.datePickerContainer}>
                                <View style={styles.dateControl}>
                                    <TouchableOpacity onPress={() => changeDate('day', -1)}><Ionicons name="remove-circle-outline" size={28} color={COLORS.maroon} /></TouchableOpacity>
                                    <Text style={styles.dateValue}>{weddingDate.getDate()}</Text>
                                    <TouchableOpacity onPress={() => changeDate('day', 1)}><Ionicons name="add-circle-outline" size={28} color={COLORS.maroon} /></TouchableOpacity>
                                </View>
                                <View style={styles.dateControl}>
                                    <TouchableOpacity onPress={() => changeDate('month', -1)}><Ionicons name="chevron-back" size={24} color={COLORS.maroon} /></TouchableOpacity>
                                    <Text style={styles.dateValue}>{weddingDate.toLocaleString('default', { month: 'short' })}</Text>
                                    <TouchableOpacity onPress={() => changeDate('month', 1)}><Ionicons name="chevron-forward" size={24} color={COLORS.maroon} /></TouchableOpacity>
                                </View>
                                <View style={styles.dateControl}>
                                    <TouchableOpacity onPress={() => changeDate('year', -1)}><Ionicons name="remove-circle-outline" size={28} color={COLORS.maroon} /></TouchableOpacity>
                                    <Text style={styles.dateValue}>{weddingDate.getFullYear()}</Text>
                                    <TouchableOpacity onPress={() => changeDate('year', 1)}><Ionicons name="add-circle-outline" size={28} color={COLORS.maroon} /></TouchableOpacity>
                                </View>
                            </View>

                            {/* Service Checklist Section */}
                            <Text style={styles.configSectionTitle}>Mark Booked Services …</Text>
                            <View style={styles.checklistContainer}>
                                {serviceCategories.map((service) => (
                                    <View key={service.id} style={styles.checklistItem}>
                                        <Text style={styles.checklistLabel}>{service.title}</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: COLORS.gold }}
                                            thumbColor={bookedServices.includes(service.id) ? COLORS.maroon : "#f4f3f4"}
                                            onValueChange={() => toggleService(service.id)}
                                            value={bookedServices.includes(service.id)}
                                        />
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.saveConfigButton}
                                onPress={() => setConfigModalVisible(false)}
                            >
                                <Text style={styles.saveConfigText}>Save Details</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </BlurView>
                </View>
            </Modal>
        );
    };

    const renderFilterModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={filterModalVisible}
            onRequestClose={() => setFilterModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <BlurView intensity={90} tint="light" style={styles.configModalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter Services</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                            <Ionicons name="close" size={24} color={COLORS.maroon} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.configSectionTitle}>Category</Text>
                        <View style={styles.filterChipContainer}>
                            {filterCategories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
                                    onPress={() => setActiveCategory(cat)}
                                >
                                    <Text style={[styles.filterChipText, activeCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.saveConfigButton}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.saveConfigText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </BlurView>
            </View>
        </Modal>
    );

    const renderHeader = () => {
        const searchWidth = searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [45, width - 40],
        });

        const titleOpacity = searchAnim.interpolate({
            inputRange: [0, 0.5],
            outputRange: [1, 0],
        });

        return (
            <View style={styles.headerContainer}>
                <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
                    <Text style={styles.headerTitle}>Services</Text>
                    <Text style={styles.headerSubtitle}>Because every love story deserves perfection</Text>
                </Animated.View>

                <View style={[
                    styles.headerRight,
                    isSearchExpanded && {
                        position: 'absolute',
                        right: 20,
                        top: Platform.OS === 'android' ? 50 : 60,
                        zIndex: 20
                    }
                ]}>
                    <Animated.View style={[styles.searchContainer, { width: searchWidth }, isSearchExpanded && { height: 'auto' }]}>
                        {isSearchExpanded ? (
                            <BlurView intensity={30} tint="light" style={styles.glassSearchExpanded}>
                                <View style={styles.searchRow}>
                                    <Ionicons name="search" size={20} color={COLORS.maroon} style={styles.searchIconInside} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search services..."
                                        placeholderTextColor={COLORS.textLight}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoFocus={true}
                                    />
                                    <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
                                        <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.suggestionContainer}>
                                    <Text style={styles.suggestionHeader}>Suggestions:</Text>
                                    <View style={styles.suggestionChipsWrapper}>
                                        {serviceCategories
                                            .filter(service => popularSearches.includes(service.title))
                                            .map((service) => (
                                                <TouchableOpacity
                                                    key={service.id}
                                                    style={styles.suggestionItemCircle}
                                                    onPress={() => {
                                                        showAlert(
                                                            "Coming Soon 🌟",
                                                            `${service.title} is currently under setup. We will make it available very soon for your best experience!`
                                                        );
                                                    }}
                                                >
                                                    <View style={styles.suggestionIconContainer}>
                                                        <Image
                                                            source={typeof service.icon === 'string' ? { uri: service.icon } : service.icon}
                                                            style={styles.suggestionIconImage}
                                                        />
                                                    </View>
                                                    <Text style={styles.suggestionTextCircle} numberOfLines={1}>{service.title}</Text>
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                </View>
                            </BlurView>
                        ) : (
                            <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
                                <Ionicons name="search" size={22} color={COLORS.maroon} />
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    {!isSearchExpanded && (
                        <TouchableOpacity
                            style={[styles.iconButton, { marginLeft: 10 }]}
                            onPress={() => setFilterModalVisible(true)}
                        >
                            <Ionicons name="filter" size={22} color={COLORS.maroon} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderProgressTracker = () => {
        const today = new Date();
        const timeDiff = weddingDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const progress = Math.round((bookedServices.length / serviceCategories.length) * 100);

        return (
            <View style={styles.progressSection}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setConfigModalVisible(true)}
                >
                    <LinearGradient
                        colors={[COLORS.maroon, '#500000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.progressCard}
                    >
                        <View style={styles.progressContent}>
                            <View>
                                <Text style={styles.progressLabel}>Wedding Countdown</Text>
                                <Text style={styles.progressValue}>
                                    {daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? 'Today is the Day!' : 'Just Married!'}
                                </Text>
                            </View>
                            <View style={styles.progressCircle}>
                                <Text style={styles.progressPercent}>{progress}%</Text>
                                <Text style={styles.progressDone}>Done</Text>
                            </View>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressFooter}>
                            {bookedServices.length} of {serviceCategories.length} Services Booked
                            {daysLeft > 0 ? ' • Tap to Edit' : ''}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    const renderAgenciesAndManagement = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Elite Management & Agencies</Text>
            </View>
            <View style={styles.agenciesRow}>
                {/* Agency Card */}
                <TouchableOpacity
                    style={styles.agencyCard}
                    activeOpacity={0.9}
                    onPress={() => showAlert("Coming Soon 🌟", "Wedding Agencies is currently under setup. We will make it available very soon for your best experience!")}
                >
                    <ImageBackground
                        source={require('../../../assets1/images/venue1.jpg')}
                        style={styles.agencyCardBg}
                        imageStyle={{ borderRadius: 24 }}
                    >
                        <BlurView intensity={40} tint="dark" style={styles.agencyCardOverlay}>
                            <Ionicons name="lock-closed" size={24} color="#FFD700" style={{ marginBottom: 5 }} />
                            <Text style={styles.agencyCardTitle}>Wedding Agencies</Text>
                        </BlurView>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Unique Event Management Card */}
                <EventManagementUniqueCard
                    onPress={() => showAlert("Coming Soon 🌟", "Event Management is currently under setup. We will make it available very soon for your best experience!")}
                />
            </View>
        </View>
    );

    const renderRecommendations = () => {
        if (filteredRecommendations.length === 0) return null;

        return (
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {searchQuery ? 'Matching Recommendations' : 'Recommended For You'}
                    </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {filteredRecommendations.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.recCard}
                            activeOpacity={0.9}
                            onPress={() => handleServicePress(item)}
                        >
                            <ImageBackground
                                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                style={styles.recImage}
                                imageStyle={{ borderRadius: 16 }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.recGradient}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Text style={styles.recTitle}>{item.title}</Text>
                                        <Ionicons name="lock-closed" size={14} color="#FFF" style={{ opacity: 0.8 }} />
                                    </View>
                                    <Text style={styles.recSubtitle}>{item.subtitle}</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View >
        );
    };

    const renderServiceGrid = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {searchQuery ? 'Matching Services' : 'All Services'}
                </Text>
                {!searchQuery && <TouchableOpacity><Text style={styles.seeAllText}></Text></TouchableOpacity>}
            </View>

            {filteredServices.length > 0 ? (
                <View style={styles.grid}>
                    {filteredServices.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.gridItem}
                            onPress={() => handleServicePress(item)}
                        >
                            <View style={styles.gridIconContainer}>
                                <Image
                                    source={typeof item.icon === 'string' ? { uri: item.icon } : item.icon}
                                    style={styles.gridIconImage}
                                />
                                <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: "rgba(128,0,0,0.85)", borderRadius: 12, padding: 3, borderWidth: 1, borderColor: "#FFF" }}>
                                    <Ionicons name="lock-closed" size={10} color="#FFF" />
                                </View>
                            </View>
                            <Text style={styles.gridLabel} numberOfLines={1}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <Text style={{ textAlign: 'center', color: '#888', marginTop: 10, fontFamily: 'serif' }}>
                    {searchQuery && filteredRecommendations.length > 0 ? 'No matching services.' : ''}
                </Text>
            )}

            {!!searchQuery && filteredServices.length === 0 && filteredRecommendations.length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 50 }}>
                    <Ionicons name="search-outline" size={64} color="#ccc" />
                    <Text style={{ marginTop: 10, color: '#888', fontWeight: '500' }}>
                        No results found for "{searchQuery}"
                    </Text>
                </View>
            )}
        </View>
    );

    const renderPlanningTools = () => (
        <Animated.View style={[styles.sectionContainer, { opacity: toolsFadeAnim, transform: [{ translateY: toolsFadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Wedding Tools</Text>
            </View>
            <View style={styles.toolsGrid}>
                {planningTools.map((tool, index) => (
                    <AnimatedToolCard
                        key={tool.id}
                        tool={tool}
                        onPress={() => {
                            showAlert("Coming Soon 🌟", `${tool.title} tool is currently under setup. We will make it available very soon for your best experience!`);
                        }}
                    />
                ))}
            </View>
        </Animated.View>
    );
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            {renderHeader()}

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {renderProgressTracker()}
                {renderRecommendations()}
                {renderServiceGrid()}
                {renderAgenciesAndManagement()}
                {renderPlanningTools()}
            </ScrollView>

            {/* Configuration Modal */}
            {renderConfigModal()}

            {/* Filter Modal */}
            {renderFilterModal()}
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: { // Corrected from 'header'
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 50, // More padding for status bar alignment
        marginBottom: 20,
    },
    titleContainer: { // Added missing style
        flex: 1,
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.maroon,
        fontFamily: 'serif',
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
        marginTop: 5,
        lineHeight: 20,
    },
    headerRight: { // Added missing style
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    searchContainer: { // Corrected for animation
        height: 45,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.5)', // Gold
        justifyContent: 'center',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    glassSearchExpanded: { // Added missing
        flex: 1,
        width: '100%',
    },
    searchRow: { // Added missing
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 45,
    },
    searchIconInside: { // Added missing
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: COLORS.textMain,
        fontSize: 16,
    },
    closeButton: {
        padding: 5,
    },
    iconButton: { // Corrected for search toggle and filter
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)', // Gold light
    },
    suggestionContainer: {
        padding: 15,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    suggestionHeader: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 10,
        fontWeight: '600',
        marginLeft: 5,
    },
    suggestionChipsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    suggestionItemCircle: {
        alignItems: 'center',
        marginBottom: 15,
        width: '30%',
    },
    suggestionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: COLORS.gold,
        backgroundColor: '#FFF',
    },
    suggestionIconImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    suggestionTextCircle: {
        fontSize: 11,
        color: COLORS.textMain,
        textAlign: 'center',
        fontWeight: '500',
    },
    progressSection: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    progressCard: {
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: COLORS.maroon,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: COLORS.maroon,
    },
    progressContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    progressLabel: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        letterSpacing: 1,
    },
    progressValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    progressPercent: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressDone: {
        color: '#FFD700',
        fontSize: 10,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 3,
    },
    progressFooter: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.maroon,
        fontFamily: 'serif',
    },
    seeAllText: {
        color: COLORS.gold,
        fontWeight: '600',
    },
    horizontalScroll: {
        paddingLeft: 20,
        paddingRight: 20, // Increased
        paddingVertical: 20, // Added to allow shadows to breathe
    },
    showcaseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    showcaseHeaderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.maroon,
        fontFamily: 'serif',
        textShadowColor: 'rgba(212, 175, 55, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    showcaseTabs: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    activeShowcaseTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.maroon,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    activeShowcaseTabText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    inactiveShowcaseTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        gap: 6,
    },
    inactiveShowcaseTabText: {
        color: COLORS.maroon,
        fontSize: 12,
        fontWeight: '600',
    },
    showcaseCardWrapper: {
        width: 240, // Slightly wider
        height: 320, // Slightly taller
        marginRight: 25, // Increased spacing
        marginVertical: 10, // Added to separate from shadows
    },
    glassBorderContainer: {
        flex: 1,
        borderRadius: 35,
        padding: 16, // Thicker glass frame for 3D casing look
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        overflow: 'hidden', // Required for BlurView absoluteFill
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 15,
    },
    showcaseImage: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
    },
    showcaseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-end',
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    showcaseBadgeIcon: {
        fontSize: 12,
    },
    showcaseBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    showcaseTitleOverlay: {
        padding: 15,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    showcaseTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    showcaseDecorator: {
        width: 30,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 2,
        marginTop: 8,
    },
    recCard: {
        width: 280,
        height: 180,
        marginRight: 15,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        backgroundColor: '#FFF',
    },
    recImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    recGradient: {
        padding: 15,
    },
    recTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    recSubtitle: {
        color: '#FFD700',
        marginTop: 4,
        fontSize: 12,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    gridItem: {
        width: '33.33%',
        marginBottom: 20,
        alignItems: 'center',
    },
    gridIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 8,
        elevation: 4,
        shadowColor: COLORS.maroon,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: '#FFF',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridIconImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        resizeMode: 'cover',
    },
    gridLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
    },
    toolCardWrapper: {
        width: (width - 50) / 2,
        padding: 5,
    },
    toolCard: {
        padding: 15,
        borderRadius: 16,
        height: 150,
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    toolHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    toolIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolTextContainer: {
        flex: 1,
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    toolDesc: {
        fontSize: 11,
        color: COLORS.textLight,
        opacity: 0.8,
    },
    // Configuration & Filter Modal Styles
    configModalContainer: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        maxHeight: '85%',
        minHeight: '60%',
    },
    configSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.maroon,
        marginTop: 15,
        marginBottom: 15,
        fontFamily: 'serif',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dateControl: {
        alignItems: 'center',
    },
    dateValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginVertical: 5,
    },
    checklistContainer: {
        marginBottom: 20,
    },
    checklistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    checklistLabel: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    filterChipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.gold,
        marginRight: 10,
        marginBottom: 10,
    },
    filterChipActive: {
        backgroundColor: COLORS.maroon,
        borderColor: COLORS.maroon,
    },
    filterChipText: {
        color: COLORS.textMain,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    saveConfigButton: {
        backgroundColor: COLORS.maroon,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        elevation: 3,
        shadowColor: COLORS.maroon,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    saveConfigText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    glassModal: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        maxHeight: '80%',
        minHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.maroon,
        fontFamily: 'serif',
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 20,
    },
    suggestionsList: {
        // marginBottom: 20,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    suggestionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    suggestionText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textMain,
    },
    viewAllButton: {
        backgroundColor: COLORS.maroon,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    viewAllBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    modalItem: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    modalIconContainer: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.surface,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMain,
        marginBottom: 5,
        textAlign: 'center',
    },
    closeModalButton: {
        padding: 5,
    },
    viewAllText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    agenciesRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    agencyCard: {
        width: '48%',
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    agencyCardBg: {
        flex: 1,
    },
    agencyCardOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    agencyCardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'serif',
    },
    agencyCardSubtitle: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    uniqueCardWrapper: {
        width: '48%',
        height: 200,
    },
    uniqueCard: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: COLORS.maroon,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    uniqueCardGradient: {
        flex: 1,
        padding: 2, // Border effect
        borderRadius: 24,
    },
    uniqueCardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 22,
        opacity: 0.6,
    },
    uniqueCardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 0, 0, 0.4)',
        borderRadius: 22,
    },
    uniqueCardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        fontFamily: 'serif',
    },
    uniqueCardTag: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '800',
        marginTop: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
        letterSpacing: 1,
    }
});

export default Services2;
