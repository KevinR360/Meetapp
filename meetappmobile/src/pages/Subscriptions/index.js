import React, {useState, useEffect} from 'react';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';
import Header from '~/components/Header';

import {
  Container,
  MeetupsList,
  Meetup,
  Banner,
  Title,
  Infos,
  DateMeetup,
  AddressMeetup,
  Author,
  CancelSubscribeButton,
  MeetupEmpty,
  EmptyText,
} from './styles';

import api from '~/services/api';

export default function Subscriptions({isFocused}) {
  const [meetups, setMeetups] = useState([]);

  async function loadMeetups() {
    const response = await api.get('subscribe');

    const data = response.data.map(subscribe => ({
      ...subscribe,
      dateMeetupFormated: format(
        parseISO(subscribe.meetup.date),
        "dd 'de' MMMM",
        {
          locale: pt,
        },
      ),
    }));

    setMeetups(data);
  }

  useEffect(() => {
    if (isFocused) {
      loadMeetups();
    }
  }, [isFocused]);

  useEffect(() => {
    loadMeetups();
  }, []);

  async function handleCancelSubscribe(id) {
    await api.delete(`subscribe/${id}/cancel`);
    loadMeetups();
  }

  return (
    <Background>
      <Header />
      <Container>
        {meetups.length > 0 ? (
          <MeetupsList
            data={meetups}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <Meetup>
                <Banner
                  source={{
                    uri: item.meetup.file
                      ? `http://10.0.3.2:3333/files/${item.meetup.file.path}`
                      : 'https://api.adorable.io/avatars/150/abott@adorable.png',
                  }}
                />
                <Title>{item.meetup.title}</Title>
                <Infos>
                  <DateMeetup>{item.dateMeetupFormated}</DateMeetup>
                  <AddressMeetup>{item.meetup.location}</AddressMeetup>
                  <Author>{`Organizador: ${item.meetup.author.name}`}</Author>
                </Infos>
                <CancelSubscribeButton
                  onPress={() => handleCancelSubscribe(item.id)}>
                  Cancelar Inscrição
                </CancelSubscribeButton>
              </Meetup>
            )}
          />
        ) : (
          <MeetupEmpty>
            <Icon
              name="event-busy"
              size={150}
              color=" rgba(255, 255, 255, 0.5)"
            />
            <EmptyText>Que pena não há eventos nessa data!</EmptyText>
          </MeetupEmpty>
        )}
      </Container>
    </Background>
  );
}

Subscriptions.navigationOptions = {
  tabBarLabel: 'Incrições',
  tabBarIcon: ({tintColor}) => (
    <Icon name="local-offer" size={20} color={tintColor} />
  ),
};
