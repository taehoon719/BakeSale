import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    PanResponder, 
    Animated,
    Dimensions,    
    Button,
    Linking,
} from 'react-native';
import {priceDisplay} from '../util';
import ajax from '../ajax';

export default class DealDetail extends Component {
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            this.imageXPos.setValue(gesture.dx);
        },
        onPanResponderRelease: (event, gesture) => {
            this.width = Dimensions.get('window').width;
            if (Math.abs(gesture.dx) > this.width*0.4) {
                const direction = Math.sign(gesture.dx);
                //Swipe left and increase image by 
                Animated.timing(this.imageXPos, {
                    toValue: direction*this.width,
                    duration: 250,
                }).start(() => this.handleSwipe(-1*direction));
            } else {
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                }).start();
            }
        }
    });
    handleSwipe = (indexDirection) => {
        if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
            return;
        }
        this.setState((prevState) => ({
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            this.imageXPos.setValue(indexDirection*this.width);
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
        })
    }
    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        console.log(fullDeal);
        this.setState({
            deal: fullDeal,
        });
    }
    openDealUrl = () => {
        Linking.openURL(this.state.deal.url);
    }
    render() {
        const {deal} = this.state;
        return (
            <ScrollView style={styles.deal}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.back}>Back</Text>
                </TouchableOpacity>
                <Animated.Image 
                    {...this.imagePanResponder.panHandlers}
                    source={{uri: deal.media[this.state.imageIndex]}}
                    style={[{left: this.imageXPos}, styles.image]}
                />
                <View>
                    <Text style={styles.title}>{deal.title}</Text>
                </View>
                <View style={styles.detail}>
                    <View style={styles.footer}>
                        <View style={styles.info}>
                            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                            <Text style={styles.cause}>{deal.cause.name}</Text>
                        </View>
                        {deal.user && (
                        <View style={styles.user}>
                            <Image 
                                source={{uri: deal.user.avatar}}
                                style={styles.avatar}
                            />
                            <Text>{deal.user.name}</Text>
                            </View>
                            )}
                    </View>
                    <View style={styles.description}>
                        <Text>{deal.description}</Text>
                    </View>
                    <Button title="Buy this deal" onPress={this.openDealUrl} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    deal: {
        marginBottom: 20,
    },
    back: {
        marginBottom: 5,
        marginLeft: 10,
        color: 'blue',
        fontSize: 20,
        fontWeight: 'bold'
    },
    info: {
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        padding: 10,
        backgroundColor: 'skyblue',        
    },
    price: {
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    cause: {
        marginVertical: 15,
    },
    description: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderStyle: 'dotted',
        margin: 10,
        padding: 10,
    },
    user: {
        alignItems: 'center',
    }
});