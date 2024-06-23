import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { IUser, updateUserProfile } from './api';
import Input from '../../components/input';
import { avatars } from './avatars';
import styles from "./styles.module.css"
import Button from '../../components/button';
import { Dispatch, SetStateAction } from 'react';

interface EditProfileProps {
    setIsEditing: Dispatch<SetStateAction<boolean>>,
    email?: string
    avatar?: string
}

const EditProfile: React.FC<EditProfileProps> = ({ setIsEditing, email = "", avatar = "" }) => {
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            email: email,
            avatar: avatar,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: IUser) => updateUserProfile(data),
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries({
                queryKey: ["profile"]
            })
        }
    });

    const onSubmit = (formData: IUser) => {
        mutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Controller
                    name="avatar"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return <div>
                            {Object.entries(avatars).map(([avatarName, avatar]) => {
                                return <button key={avatarName} type='button' className={styles.avatarBtn} onClick={() => {
                                    onChange(avatarName);
                                    onBlur();
                                }}><img className={`${styles.avatarImage} ${value === avatarName ? styles.avatarImageSelected : ""} ${styles.avatarSmall}`} alt={avatarName} src={avatar as any} /></button>
                            })}
                        </div>
                    }} />
                <Input
                    register={register}
                    placeholder='Email'
                    name='email'
                    registerOptions={{
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email format',
                        },
                    }}
                    type="email"
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={() => setIsEditing(false)}>
                Cancel
            </Button>
        </form>
    )
};

export default EditProfile;
