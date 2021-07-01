import {useState, FC} from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
import * as Yup from 'yup';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button } from '@material-ui/core';

const schema = Yup.object().shape({
    username: Yup
    .string()
    .required('Username is a required field')
    .min(5)
    .max(16, 'Username cannot be longer than 16 characters')
    .matches(/^([^0-9]*)$/, 'User name should not contain numbers'),
    password: Yup
    .string()
    .required('Whithout a pssword, "None shall pass!'),
    email: Yup
    .string()
    .required('Email is a required field')
    .email('Please provide a valid email address (abc@test.com)'),
});

const Auth: FC = () => {
    const { handleSubmit, register, formState:{ errors } } = useForm<User>({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const submitForm = (data: User) => {
        const path = isLogin ? '/auth/login' : '/auth/signup';
        http
        .post<User, AuthResponse>(path, data)
        .then((res) => {
            if(res) {
                const { user, token } = res;
                dispatch(saveToken(token));
                dispatch(setUser(user));
                dispatch(setAuthState(true));
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className='auth'>
            <div className="card">
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="inputWrapper">
                        <TextField 
                            {...register('username')}
                            fullWidth
                            label="Username"
                            variant="outlined"
                            type="text" name="username"
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            margin="dense"
                        />
                    </div>

                        <div className="inputWrapper">
                            <TextField 
                                {...register('password')}
                                fullWidth
                                label="Password"
                                variant="outlined"
                                type="password" name="password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                margin="dense"
                            />
                        </div>

                        {!isLogin && (
                            <div className="inputWrapper">
                                <TextField 
                                    {...register('email')}
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email" name="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    margin="dense"
                                />
                            </div>
                        )}

                        <div className="inputWrapper">
                            <Button 
                                type="submit"
                                color="primary"
                                disabled={loading}
                                variant="contained">
                                {isLogin ? 'Login': 'CreateAccount'}
                            </Button>
                        </div>
                        <p
                            onClick={() => setIsLogin(!isLogin)}
                            style={{cursor: 'pointer', opacity: 0.7}}
                        >
                            { isLogin ? 'No account? Create one': 'Already have an account?' }
                        </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;