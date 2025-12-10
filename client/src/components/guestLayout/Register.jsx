// import React, { useEffect, useState } from "react";
// import Loader from "../CustomStyles/Loader";
// import axios from "axios";
// import { Row, Col, Form, Alert, Button, Container, Nav } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// import AOS from "aos";
// import CustomCursor from "../CustomStyles/CustomCursor";

// const Register = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     AOS.init({
//       duration: 300,
//       easing: "linear",
//       once: true,
//     });
//   }, []);

//   const today = new Date().toISOString().split("T")[0];

//   const [loader, setLoader] = useState(false);
//   const [validated, setValidated] = useState(false);
//   const [image, setImage] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [spammer, setSpammer] = useState();
//   const [registerData, setRegisterData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     emailVerification: "",
//     phoneNumber: "",
//     profilePicture: "",
//     userStatus: "inactive",
//     role: "User",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRegisterData({
//       ...registerData,
//       [name]: value,
//     });
//   };

//   const handleVerify = async () => {
//     if (registerData.email.includes("@gmail.com")) {
//       setLoader(true);
//       try {
//         const res = await axios.post(`http://localhost:8000/user/verifyEmail`, {
//           email: registerData.email,
//         });
//         const audio = new Audio("/Success_Sound.mp3");
//         audio.currentTime = 1;
//         audio.play();
//         setSuccessMessage("Email Verification Code sent");
//       } catch (error) {
//         setError("Error in sending verification code");
//         const audio = new Audio("/Error_Sound.mp3");
//         audio.currentTime = 0.5;
//         audio.play();
//       }
//       setLoader(false);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileType = file.type.split("/")[0];
//       if (fileType === "image") {
//         setImage(file);
//         setImagePreview(URL.createObjectURL(file));
//       } else {
//         alert("Please upload a valid image file");
//         setImage(null);
//         setImagePreview(null);
//       }
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     window.scrollTo(0, 0);
//     const form = event.currentTarget;

//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//     }
//     setValidated(true);

//     if (form.checkValidity()) {
//       try {
//         const spamCheck = await axios.post("http://localhost:8000/user/spam", {
//           email: registerData.email,
//         });
//         if (spamCheck.data.spam) {
//           setError("You are banned from this site");
//           return;
//         }
//       } catch (error) {
//         console.log("Error in spam check:", error);
//         setError("Error in spam check");
//       }

//       try {
//         let filePath = "";
//         if (image) {
//           const formData = new FormData();
//           formData.append("file", image);
//           const uploadResponse = await axios.post("http://localhost:8000/upload", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });
//           if (uploadResponse.data.filePath) {
//             filePath = uploadResponse.data.filePath;
//           } else {
//             setError("File upload failed. Please try again.");
//             setSuccessMessage("");
//             return;
//           }
//         }

//         const updateRegisterData = {
//           ...registerData,
//           profilePicture: filePath,
//         };

//         const registerResponse = await axios.post("http://localhost:8000/user", updateRegisterData);
//         if (registerResponse.status === 201) {
//           setSuccessMessage("User registered successfully");
//           setError("");
//           const audio = new Audio("/Success_Sound.mp3");
//           audio.currentTime = 1;
//           audio.play();
//           setRegisterData({
//             firstName: "",
//             lastName: "",
//             email: "",
//             emailVerification: "",
//             phoneNumber: "",
//             profilePicture: "",
//             userStatus: "inactive",
//             role: "User",
//             password: "",
//             confirmPassword: "",
//           });
//           setImage("");
//           setImagePreview(null);
//         } else if (registerResponse.status === 420) {
//           setError("Invalid verification code");
//           const audio = new Audio("/Error_Sound.mp3");
//           audio.currentTime = 0.5;
//           audio.play();
//         } else {
//           setError("Error registering user. Please try again.");
//           const audio = new Audio("/Error_Sound.mp3");
//           audio.currentTime = 0.5;
//           audio.play();
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Error during registration. Please try again.");
//         const audio = new Audio("/Error_Sound.mp3");
//         audio.currentTime = 0.5;
//         audio.play();
//         console.log(error);
//       }
//     }
//   };

//   const styles = {
//     border: "2px solid black",
//     backgroundImage: "linear-gradient(rgba(255, 147, 15,0.3),rgba(255, 249, 91,0.3))",
//     borderRadius: "0 30px",
//   };

//   return (
//     <div style={{ padding: "5vw", backgroundImage: "linear-gradient(rgba(255, 147, 15,0.1),rgba(255, 249, 91,0.1),rgba(255,147,15,0.1))" }}>
//       <CustomCursor color="red" size="20px" index="0" />
//       <Container style={styles} data-aos="fade-down">
//         <center><h2>Register</h2></center>
//         {loader && <Loader size="30px" border="6px" color="rgb(0, 0, 0)" />}
//         {error && <Alert variant="danger" dismissible>{error}</Alert>}
//         {successMessage && <Alert variant="success" dismissible>{successMessage}</Alert>}
//         <Form noValidate onSubmit={handleSubmit} validated={validated ? true : false}>
//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group controlId="firstName">
//                 <Form.Label>First Name</Form.Label>
//                 <Form.Control type="text" placeholder="First name" name="firstName" value={registerData.firstName} onChange={handleChange} required pattern="[a-zA-Z]{2,9}" />
//                 <Form.Control.Feedback type="invalid">Please enter a valid first name (2-9 letters only).</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group controlId="lastName">
//                 <Form.Label>Last Name</Form.Label>
//                 <Form.Control type="text" placeholder="Last name" name="lastName" value={registerData.lastName} onChange={handleChange} required />
//                 <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={8}>
//               <Form.Group controlId="email">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" placeholder="Email" name="email" value={registerData.email} onChange={handleChange} required />
//                 <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Label>Verification</Form.Label><br />
//               <Button onClick={handleVerify}>Get verification code</Button>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group controlId="emailVerification">
//                 <Form.Label>Verification Code</Form.Label>
//                 <Form.Control type="number" placeholder="Enter code sent to email" name="emailVerification" value={registerData.emailVerification} onChange={handleChange} required />
//                 <Form.Control.Feedback type="invalid">Please enter the verification code.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group controlId="phoneNumber">
//                 <Form.Label>Phone Number</Form.Label>
//                 <Form.Control type="tel" placeholder="Phone number" name="phoneNumber" value={registerData.phoneNumber} onChange={handleChange} required pattern="[6789][0-9]{9}" />
//                 <Form.Control.Feedback type="invalid">Enter valid phone number starting with 6,7,8, or 9.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group controlId="role">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Control as="select" name="role" value={registerData.role} onChange={handleChange} required>
//                   <option value="User">User</option>
//                   <option value="Admin">Admin</option>
//                 </Form.Control>
//                 <Form.Control.Feedback type="invalid">Please select a role.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={8}>
//               <Form.Group>
//                 <Form.Label>Profile Picture</Form.Label>
//                 <Form.Control type="file" accept="image/*" name="image" onChange={handleFileChange} required />
//                 <Form.Control.Feedback type="invalid">Please upload a valid image file.</Form.Control.Feedback>
//                 {imagePreview && (
//                   <div className="mt-2">
//                     <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover", borderRadius: "10px" }} />
//                   </div>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group controlId="password">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control type="password" placeholder="Password" name="password" value={registerData.password} onChange={handleChange} required minLength="6" autoComplete="new-password" />
//                 <Form.Control.Feedback type="invalid">Password must be at least 6 characters.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group controlId="confirmPassword">
//                 <Form.Label>Confirm Password</Form.Label>
//                 <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={registerData.confirmPassword} onChange={handleChange} required minLength="6" />
//                 <Form.Control.Feedback type="invalid">Passwords must match.</Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6} className="text-center" style={{ lineHeight: "20px" }}>
//               <Nav.Link as={NavLink} to={"/login"}>Already have an account?</Nav.Link>
//             </Col>
//             <Col md={6} className="text-center">
//               <Button type="submit" variant="primary" className="mb-3 mt-2">Register</Button>
//             </Col>
//           </Row>
//         </Form>
//       </Container>
//     </div>
//   );
// };

// export default Register;



import React, { useEffect, useState } from "react";
import Loader from "../CustomStyles/Loader";
import axios from "axios";
import { Row, Col, Form, Alert, Button, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import CustomCursor from "../CustomStyles/CustomCursor";
import { motion } from "framer-motion";
import "aos/dist/aos.css";

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out-back",
      once: false,
      mirror: true,
      offset: 50
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [spammer, setSpammer] = useState();
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailVerification: "",
    phoneNumber: "",
    profilePicture: "",
    userStatus: "inactive",
    role: "User",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleVerify = async () => {
    if (registerData.email.includes("@gmail.com")) {
      setLoader(true);
      try {
        const res = await axios.post(`http://localhost:8000/user/verifyEmail`, {
          email: registerData.email,
        });
        const audio = new Audio("/Success_Sound.mp3");
        audio.currentTime = 1;
        audio.play();
        setSuccessMessage("Email Verification Code sent");
      } catch (error) {
        setError("Error in sending verification code");
        const audio = new Audio("/Error_Sound.mp3");
        audio.currentTime = 0.5;
        audio.play();
      }
      setLoader(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Please upload a valid image file");
        setImage(null);
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity()) {
      try {
        const spamCheck = await axios.post("http://localhost:8000/user/spam", {
          email: registerData.email,
        });
        if (spamCheck.data.spam) {
          setError("You are banned from this site");
          return;
        }
      } catch (error) {
        console.log("Error in spam check:", error);
        setError("Error in spam check");
      }

      try {
        let filePath = "";
        if (image) {
          const formData = new FormData();
          formData.append("file", image);
          const uploadResponse = await axios.post("http://localhost:8000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (uploadResponse.data.filePath) {
            filePath = uploadResponse.data.filePath;
          } else {
            setError("File upload failed. Please try again.");
            setSuccessMessage("");
            return;
          }
        }

        const updateRegisterData = {
          ...registerData,
          profilePicture: filePath,
        };

        const registerResponse = await axios.post("http://localhost:8000/user", updateRegisterData);
        if (registerResponse.status === 201) {
          setSuccessMessage("User registered successfully");
          setError("");
          const audio = new Audio("/Success_Sound.mp3");
          audio.currentTime = 1;
          audio.play();
          setRegisterData({
            firstName: "",
            lastName: "",
            email: "",
            emailVerification: "",
            phoneNumber: "",
            profilePicture: "",
            userStatus: "inactive",
            role: "User",
            password: "",
            confirmPassword: "",
          });
          setImage("");
          setImagePreview(null);
        } else if (registerResponse.status === 420) {
          setError("Invalid verification code");
          const audio = new Audio("/Error_Sound.mp3");
          audio.currentTime = 0.5;
          audio.play();
        } else {
          setError("Error registering user. Please try again.");
          const audio = new Audio("/Error_Sound.mp3");
          audio.currentTime = 0.5;
          audio.play();
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error during registration. Please try again.");
        const audio = new Audio("/Error_Sound.mp3");
        audio.currentTime = 0.5;
        audio.play();
        console.log(error);
      }
    }
  };

  const styles = {
    border: "2px solid black",
    backgroundImage: "linear-gradient(rgba(255, 147, 15,0.3),rgba(255, 249, 91,0.3))",
    borderRadius: "0 30px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "5vw", backgroundImage: "linear-gradient(rgba(255, 147, 15,0.1),rgba(255, 249, 91,0.1),rgba(255,147,15,0.1))", minHeight: "100vh" }}
    >
      <CustomCursor color="red" size="20px" index="0" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Container style={styles} data-aos="zoom-in" data-aos-delay="100">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <center>
              <h2 style={{ 
                fontSize: "2.5rem", 
                fontWeight: "bold", 
                marginBottom: "2rem",
                background: "linear-gradient(45deg,rgb(25, 21, 17))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}>
                Register
              </h2>
            </center>
          </motion.div>
          
          {loader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader size="30px" border="6px" color="rgb(0, 0, 0)" />
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
                {successMessage}
              </Alert>
            </motion.div>
          )}
          
          <Form noValidate onSubmit={handleSubmit} validated={validated ? true : false}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Row className="mb-3">
                <Col md={6}>
                  <motion.div variants={itemVariants} data-aos="fade-right" data-aos-delay="200">
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="First name" 
                        name="firstName" 
                        value={registerData.firstName} 
                        onChange={handleChange} 
                        required 
                        pattern="[a-zA-Z]{2,9}" 
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid first name (2-9 letters only).
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={6}>
                  <motion.div variants={itemVariants} data-aos="fade-left" data-aos-delay="200">
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Last name" 
                        name="lastName" 
                        value={registerData.lastName} 
                        onChange={handleChange} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={8}>
                  <motion.div variants={itemVariants} data-aos="fade-right" data-aos-delay="250">
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Email" 
                        name="email" 
                        value={registerData.email} 
                        onChange={handleChange} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={4}>
                  <motion.div variants={itemVariants} data-aos="fade-left" data-aos-delay="250">
                    <Form.Label>Verification</Form.Label><br />
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button onClick={handleVerify} style={{ width: "100%" }}>
                        Get verification code
                      </Button>
                    </motion.div>
                  </motion.div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <motion.div variants={itemVariants} data-aos="fade-right" data-aos-delay="300">
                    <Form.Group controlId="emailVerification">
                      <Form.Label>Verification Code</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Enter code sent to email" 
                        name="emailVerification" 
                        value={registerData.emailVerification} 
                        onChange={handleChange} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter the verification code.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={4}>
                  <motion.div variants={itemVariants} data-aos="fade-up" data-aos-delay="300">
                    <Form.Group controlId="phoneNumber">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="Phone number" 
                        name="phoneNumber" 
                        value={registerData.phoneNumber} 
                        onChange={handleChange} 
                        required 
                        pattern="[6789][0-9]{9}" 
                      />
                      <Form.Control.Feedback type="invalid">
                        Enter valid phone number starting with 6,7,8, or 9.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <motion.div variants={itemVariants} data-aos="fade-right" data-aos-delay="350">
                    <Form.Group controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Control 
                        as="select" 
                        name="role" 
                        value={registerData.role} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select a role.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={8}>
                  <motion.div variants={itemVariants} data-aos="fade-left" data-aos-delay="350">
                    <Form.Group>
                      <Form.Label>Profile Picture</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        name="image" 
                        onChange={handleFileChange} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        Please upload a valid image file.
                      </Form.Control.Feedback>
                      {imagePreview && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2"
                        >
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: "100px", 
                              maxHeight: "100px", 
                              objectFit: "cover", 
                              borderRadius: "10px",
                              border: "2px solid #ff9315",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                            }} 
                          />
                        </motion.div>
                      )}
                    </Form.Group>
                  </motion.div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <motion.div variants={itemVariants} data-aos="fade-right" data-aos-delay="400">
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={registerData.password} 
                        onChange={handleChange} 
                        required 
                        minLength="6" 
                        autoComplete="new-password" 
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
                <Col md={6}>
                  <motion.div variants={itemVariants} data-aos="fade-left" data-aos-delay="400">
                    <Form.Group controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        name="confirmPassword" 
                        value={registerData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                        minLength="6" 
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords must match.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </motion.div>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="text-center" style={{ lineHeight: "20px" }}>
                  <motion.div 
                    variants={itemVariants} 
                    data-aos="fade-right" 
                    data-aos-delay="450"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Nav.Link as={NavLink} to={"/login"}>
                      Already have an account?
                    </Nav.Link>
                  </motion.div>
                </Col>
                <Col md={6} className="text-center">
                  <motion.div 
                    variants={itemVariants} 
                    data-aos="fade-left" 
                    data-aos-delay="450"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="mb-3 mt-2"
                      style={{
                        background: "linear-gradient(45deg, #ff9315, #fff95b)",
                        border: "none",
                        padding: "10px 30px",
                        fontWeight: "bold",
                        color: "#000"
                      }}
                    >
                      Register
                    </Button>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </Form>
        </Container>
      </motion.div>
    </motion.div>
  );
};

export default Register;