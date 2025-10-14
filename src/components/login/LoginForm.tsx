import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useLogin} from "../../api/auth/useAuth.ts";


export default function LoginForm() {

    const [form, setForm] = useState({name: '', password: ''});
    const {mutate: login, isPending} = useLogin();

    const navigate = useNavigate();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login(form, {
            onSuccess: () => navigate('/dashboard'),
        });
    };

    console.log(isPending, 'isPending');
    return (
        <>
            <section className="login_register section-padding">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-xs-12 wow fadeIn">
                            <form onSubmit={handleSubmit} className="login">
                                <h4 className="login_register_title">Already a member? Sign in:</h4>
                                <div className="form-group">
                                    <label htmlFor="contact-name">Username</label>
                                    <input type="text" id="contact-name" placeholder="Enter Username"
                                           onChange={(e) => setForm({...form, name: e.target.value})}
                                           className="form-control" name="name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-password">Password</label>
                                    <input type="password" placeholder="Enter Password" id="contact-password"
                                           onChange={(e) => setForm({...form, password: e.target.value})}
                                           className="form-control" name="password"/>
                                </div>

                                <div className="form-check mb-4">
                                    <input id="rpaword" className="form-check-input" type="checkbox"/>
                                    <label className="form-check-label" htmlFor="rpaword">
                                        Remember Password
                                    </label>
                                </div>

                                <div className="form-group col-lg-12">
                                    <button className="bg_btn bt" disabled={isPending} type="submit"
                                            name="submit">login
                                    </button>
                                </div>
                                <p>Dont have an account? <Link to="/register">Register Now</Link></p>
                            </form>
                        </div>
                        <div className="col-lg-6 col-xs-12 wow fadeIn">
                            <div className="login d-none d-lg-block">
                                <img src="assets/img/about.png" height={'100%'} alt="ewfef"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
