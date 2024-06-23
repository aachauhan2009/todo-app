import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from './api';
import { avatars } from './avatars';
import styles from "./styles.module.css"
import Button from '../../components/button';
import EditProfile from './edit';

const Profile: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  });

  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isEditing ? <EditProfile email={data?.data.email} avatar={data?.data.avatar} setIsEditing={setIsEditing} /> : (
        <div className={styles.container}>
          {!!(data?.data?.avatar && avatars[data?.data?.avatar]) ? <img className={styles.avatarImage} src={avatars[data?.data?.avatar]} alt="avatar" /> : <div className={styles.avatar}>{data?.data?.name[0]}</div>}
          <div className={styles.details}>
            <p><strong>Name:</strong> {data?.data?.name}</p>
            <p><strong>Email:</strong> {data?.data?.email}</p>
          </div>
          <Button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
