## **AUTONOMOUS VEHICLE TELEMATICS & CABIN SAFETY SYSTEM**

**Project Type:** Deep Learning Micro-Project
**Domain:** Deep Learning, Autonomous Vehicles, Vehicle Telematics, Cybersecurity
**Implementation:** Single-page web application with interactive Deep Learning backend simulator
**Live Prototype:** [Autonomous Vehicle Telematics & Cabin Safety System] :- https://autonomous-vehicle-telematics-cabin.vercel.app/

Below is a **detailed, academically structured report** following the exact Table of Contents you provided. I have also kept the report technically honest: the system is an **interactive deep-learning simulation/prototype**, rather than claiming that a production autonomous vehicle is actually being controlled by trained CNN/LSTM/ANN models.

---

# TABLE OF CONTENTS

| Sl. No. | Particulars                         |
| ------: | ----------------------------------- |
|       1 | Abstract                            |  
|       2 | Introduction                        |  
|       3 | Problem Statement                   |  
|       4 | Proposed Solution                   |  
|       5 | Literature Survey                   |  
|       6 | System Architecture / System Design |  
|       7 | Technological Stack                 | 
|       8 | Methodology                         | 
|       9 | Outputs                             | 
|      10 | Conclusion                          | 

---

# 1. ABSTRACT

The **Autonomous Vehicle Telematics & Cabin Safety System** is an interactive Deep Learning-based simulation platform developed to demonstrate how multiple neural network architectures can work together within an autonomous vehicle environment. Modern autonomous vehicles generate and process different types of information simultaneously, including environmental conditions, vehicle telemetry, spatial movement, perception information, and system-health data. Handling these heterogeneous data sources requires different machine learning and deep learning architectures.

The proposed system integrates four major Deep Learning concepts into a unified vehicle intelligence dashboard: **Convolutional Neural Networks (CNNs)** for visual perception, **Recurrent Neural Networks/Long Short-Term Memory (RNN/LSTM)** for trajectory prediction, **Deep Artificial Neural Networks (ANNs)** for battery and performance estimation, and **Autoencoders** for anomaly and cybersecurity monitoring.

The application obtains live environmental telemetry through the **Open-Meteo public weather API**, eliminating the requirement for paid API keys. The received parameters, such as temperature, wind speed, humidity and weather conditions, are transformed into numerical values and used as inputs for the vehicle simulation. The geographical configuration is localized to major regions of **Karnataka, India**, including Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru, Belagavi and Kalaburagi.

The CNN module provides a simulated perception environment and displays feature-map activation patterns and classification confidence. The LSTM module maintains a sequence of vehicle coordinates and generates a predicted trajectory. The ANN module performs explicit feed-forward mathematical calculations using weights, biases and ReLU activation to estimate remaining battery range. Finally, the Autoencoder module reconstructs a system-state vector and calculates **Mean Squared Error (MSE)** to identify abnormal conditions.

An interactive **Cyber Attack / Malfunction Injection** mechanism is incorporated to demonstrate anomaly detection. Under normal conditions, the reconstruction error remains within a defined threshold. When an attack is injected, abnormal noise is introduced into the system vector, resulting in a significant increase in reconstruction error and triggering a critical safety warning.

The project therefore provides an educational visualization of how different Deep Learning architectures can cooperate within a connected autonomous vehicle ecosystem.

**Keywords:** Autonomous Vehicles, Deep Learning, CNN, LSTM, ANN, Autoencoder, Telematics, Cybersecurity, Open-Meteo, Neural Networks, Anomaly Detection, Vehicle Safety.

---

# 2. INTRODUCTION

## 2.1 Background of the Study

The automobile industry is undergoing a major technological transformation due to the development of connected and autonomous vehicles. Traditional vehicles primarily depend on mechanical systems and driver decisions, whereas modern intelligent vehicles increasingly depend on sensors, computational systems, communication networks, artificial intelligence and machine learning.

An autonomous vehicle continuously receives information from its surrounding environment and internal components. Environmental information may include temperature, humidity, wind conditions, visibility and weather state. Vehicle information can include speed, load, battery level, acceleration and other operational parameters. In addition, autonomous vehicles require perception and navigation capabilities to understand their environment and determine their future movement.

Deep Learning provides several architectures suitable for these different tasks. However, each architecture is designed for a particular type of data.

For example:

* **CNNs** are widely associated with spatial and visual feature extraction.
* **RNNs and LSTMs** are designed for sequential and temporal data.
* **ANNs** can model nonlinear relationships between numerical input variables and predicted outputs.
* **Autoencoders** can learn representations of normal data and use reconstruction error for anomaly detection.

The main objective of this project is to demonstrate these concepts together rather than treating each Deep Learning architecture as an isolated classroom experiment.

---

## 2.2 Autonomous Vehicle Telematics

Vehicle telematics refers to the collection, processing and communication of vehicle-related information.

In the proposed system, environmental telemetry is obtained from an open weather service. The live values are incorporated into a simulated vehicle environment.

The important parameters include:

* Ambient temperature
* Relative humidity
* Wind speed
* Weather condition
* Vehicle cruising speed
* Simulated vehicle load
* Vehicle trajectory
* Perception confidence
* Battery range estimate
* System reconstruction error

These parameters form the basis of the intelligent vehicle simulation.

---

## 2.3 Deep Learning in Autonomous Vehicles

An autonomous vehicle can be viewed as a system consisting of multiple intelligent subsystems.

A simplified mapping is:

| Autonomous Vehicle Requirement   | Deep Learning Concept |
| -------------------------------- | --------------------- |
| Visual perception                | CNN                   |
| Sequential trajectory prediction | RNN/LSTM              |
| Vehicle efficiency prediction    | ANN                   |
| Abnormal system detection        | Autoencoder           |

The project demonstrates this mapping through an interactive dashboard.

---

## 2.4 Project Motivation

Many academic Deep Learning projects demonstrate only one architecture using a static dataset. While such projects are useful for understanding individual algorithms, they do not clearly demonstrate how multiple models can interact within a larger intelligent system.

This project was therefore designed to create a common application environment where students can visualize the mathematical behavior of different Deep Learning architectures.

Another motivation was to avoid dependence on expensive APIs or proprietary cloud systems. The application uses a publicly accessible weather data source and performs the major processing within the browser.

---

## 2.5 Project Objectives

The major objectives are:

1. To develop an interactive autonomous vehicle simulation dashboard.
2. To demonstrate four important Deep Learning architectures.
3. To integrate live environmental telemetry.
4. To demonstrate CNN-based perception concepts.
5. To demonstrate sequential trajectory prediction using LSTM concepts.
6. To implement mathematical feed-forward ANN calculations.
7. To estimate vehicle battery range from environmental and vehicle parameters.
8. To implement Autoencoder-based reconstruction error monitoring.
9. To demonstrate anomaly detection using MSE.
10. To simulate a cybersecurity attack condition.
11. To visualize Deep Learning mathematical operations interactively.
12. To provide an educational backend architecture visualizer.

---

# 3. PROBLEM STATEMENT

Autonomous vehicles must process multiple forms of information simultaneously. Visual information, sequential movement information, vehicle telemetry and system-health information have different characteristics and therefore cannot always be processed efficiently using a single type of neural network.

Conventional educational implementations frequently separate CNN, RNN/LSTM, ANN and Autoencoder experiments into independent programs. This makes it difficult for students to understand how these architectures can participate in one integrated intelligent system.

Another limitation is dependence on static datasets. Static datasets are useful for model training, but they do not provide the experience of working with changing environmental conditions.

Furthermore, autonomous vehicle systems require mechanisms for identifying abnormal behavior. A malfunctioning sensor, corrupted telemetry value or unexpected data modification could result in incorrect system decisions.

Therefore, there is a need for an educational prototype that:

* Integrates multiple Deep Learning architectures.
* Processes dynamically changing telemetry.
* Demonstrates mathematical neural-network operations.
* Provides visual feedback.
* Demonstrates anomaly detection.
* Simulates a cybersecurity attack.
* Works without expensive proprietary APIs.
* Provides an accessible browser-based interface.

The proposed project addresses these requirements through an integrated autonomous vehicle telematics and safety simulation.

---

# 4. PROPOSED SOLUTION

The proposed solution is a browser-based autonomous vehicle intelligence dashboard that combines four Deep Learning concepts into a unified system.

The application can be accessed through the deployed prototype:

[Open the deployed project](https://autonomous-vehicle-telematics-cabin.vercel.app/?utm_source=chatgpt.com)

The system is divided into two major views:

### Page 1 — Live Operations Telemetry

This page represents the operational dashboard of the simulated vehicle.

It provides:

* Live weather telemetry
* Vehicle parameters
* Perception visualization
* Trajectory visualization
* Battery prediction
* Cybersecurity status
* Reconstruction-error monitoring
* Cyber attack simulation

### Page 2 — Deep Learning Backend Simulator

This page explains the mathematical processing performed behind the operational dashboard.

It contains:

* Data pipeline visualization
* CNN mathematical convolution
* LSTM gating equations
* ANN matrix calculations
* Autoencoder reconstruction
* MSE calculation
* Numerical input/output visualization

---

## 4.1 Karnataka-Based Geographical Configuration

The system is localized to Karnataka, India.

The supported locations are:

1. Bengaluru
2. Mysuru
3. Hubballi-Dharwad
4. Mangaluru
5. Belagavi
6. Kalaburagi

The selected location determines the geographical coordinates used to obtain environmental telemetry.

The general data flow is:

```text
Karnataka Location
       ↓
Latitude + Longitude
       ↓
Open-Meteo API
       ↓
Live Weather JSON
       ↓
JavaScript Parser
       ↓
Numerical Telemetry Vector
       ↓
Deep Learning Modules
```

---

# 5. LITERATURE SURVEY

## 5.1 Deep Learning for Autonomous Vehicles

Deep Learning has become an important technology in autonomous driving research because neural networks can learn complex relationships from high-dimensional data.

Visual perception systems commonly use convolution-based architectures because images contain spatial relationships between neighboring pixels.

In an autonomous vehicle environment, visual processing can be used for tasks such as:

* Lane identification
* Road-sign recognition
* Obstacle detection
* Road-scene classification
* Vehicle detection

The project represents this concept through its CNN perception engine.

---

## 5.2 Convolutional Neural Networks

CNNs are designed to extract spatial features using convolution operations.

A convolution operation can be represented as:

$$
F(i,j)=\sum_{m}\sum_{n}I(i+m,j+n)K(m,n)
$$

where:

* \(I\) represents the input image.
* \(K\) represents the convolution kernel.
* \(F\) represents the resulting feature map.

For a 3×3 kernel:

$$
F=\sum_{i=1}^{3}\sum_{j=1}^{3}P_{ij}K_{ij}
$$

The project provides an interactive visualization of this operation.

---

## 5.3 RNN and LSTM Networks

Vehicle movement is sequential. The current position of a vehicle is related to its previous positions.

RNNs are designed to process sequential information. However, conventional RNNs can face difficulties when learning long-term dependencies because of vanishing gradients.

LSTM networks address this through memory cells and gating mechanisms.

The forget gate is represented as:

$$
f_t=\sigma(W_f[h_{t-1},x_t]+b_f)
$$

The input gate is:

$$
i_t=\sigma(W_i[h_{t-1},x_t]+b_i)
$$

Candidate cell state:

$$
\tilde{C}_t=\tanh(W_C[h_{t-1},x_t]+b_C)
$$

Cell state:

$$
C_t=f_tC_{t-1}+i_t\tilde{C}_t
$$

Output gate:

$$
o_t=\sigma(W_o[h_{t-1},x_t]+b_o)
$$

Hidden state:

$$
h_t=o_t\tanh(C_t)
$$

The project visually demonstrates these concepts through the trajectory prediction module.

---

## 5.4 Artificial Neural Networks

Artificial Neural Networks consist of interconnected neurons organized into layers.

A basic neuron performs:

$$
z=Wx+b
$$

The result is then passed through an activation function.

For ReLU:

$$
ReLU(x)=\max(0,x)
$$

A multi-layer ANN can therefore be represented as:

```text
Input Layer
     ↓
Hidden Layer 1
     ↓
ReLU
     ↓
Hidden Layer 2
     ↓
ReLU
     ↓
Output Layer
     ↓
Predicted Battery Range
```

The project uses this mathematical concept to demonstrate vehicle performance estimation.

---

## 5.5 Autoencoders for Anomaly Detection

An Autoencoder contains three major components:

```text
Input
  ↓
Encoder
  ↓
Latent Representation
  ↓
Decoder
  ↓
Reconstructed Output
```

The Autoencoder attempts to reconstruct the input.

The difference between the original and reconstructed vectors can be calculated using Mean Squared Error:

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(x_i-\hat{x_i})^2
$$

where:

* \(x_i\) = original value
* \(\hat{x_i}\) = reconstructed value
* \(n\) = number of values

A larger reconstruction error indicates that the input differs significantly from the learned normal pattern.

In the project, this principle is used to demonstrate anomaly and cybersecurity monitoring.

---

# 6. SYSTEM ARCHITECTURE / SYSTEM DESIGN

## 6.1 Overall Architecture

The proposed architecture is:

```text
                  ┌───────────────────────────┐
                  │    Karnataka Location     │
                  │ Bengaluru / Mysuru / etc. │
                  └─────────────┬─────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │      Open-Meteo API       │
                  │     Live Weather Data     │
                  └─────────────┬─────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │   JSON Data Processing    │
                  │   JavaScript Telemetry    │
                  └─────────────┬─────────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
              CNN Engine    LSTM Engine    ANN Engine
                 │              │              │
                 │              │              │
                 └──────────────┼──────────────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │ Autoencoder Guard  │
                     │ Reconstruction MSE │
                     └─────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
               Normal State         Attack State
                    │                     │
                    ▼                     ▼
                GREEN SAFE          RED CRITICAL
```

---

## 6.2 Data Acquisition Layer

The system obtains live environmental information using the Open-Meteo API.

The browser performs a request similar to:

```javascript
fetch(API_URL)
```

The returned JSON contains current environmental information.

The application extracts relevant numerical values such as:

```text
Temperature
Humidity
Wind Speed
Weather Code
```

These values are converted into variables used by the vehicle simulation.

---

# 6.3 Module 1 — CNN Perception Engine

The CNN module represents the visual perception subsystem.

### Input

Simulated road-scene information.

### Processing

The conceptual pipeline is:

```text
Road Scene
    ↓
Pixel Representation
    ↓
Convolution
    ↓
Feature Maps
    ↓
Feature Extraction
    ↓
Classification
    ↓
Softmax Confidence
```

The dashboard provides a visual feature-map activation grid.

Classification examples include:

* Clear Lane
* Obstacle Ahead
* Slow Down Sign

The confidence values can be represented using Softmax:

$$
P(y_i)=\frac{e^{z_i}}{\sum_j e^{z_j}}
$$

The dashboard presents the resulting confidence values using a Chart.js visualization.

### Important implementation note

The project is intended as a **Deep Learning educational simulation**. The browser visualization demonstrates CNN concepts and mathematical operations; it should not be described as a production-trained autonomous-driving CNN unless an actual trained CNN model and dataset are added.

---

# 6.4 Module 2 — RNN/LSTM Trajectory Predictor

The trajectory module maintains a sequence of vehicle positions.

A simplified coordinate sequence can be represented as:

$$
[(x_1,y_1),(x_2,y_2),...,(x_t,y_t)]
$$

The system displays the recent trajectory on a 2D coordinate canvas.

The processing concept is:

```text
Past Coordinates
       ↓
Sequential Input
       ↓
LSTM Memory
       ↓
Temporal Pattern
       ↓
Future Coordinate Prediction
       ↓
Predicted Path
```

The dashboard therefore displays:

* Historical path
* Current vehicle position
* Predicted future path
* Coordinate grid
* Sequential movement

---

# 6.5 Module 3 — Deep ANN Battery & Performance Optimizer

The ANN receives numerical telemetry.

Example input vector:

$$
X=
\begin{bmatrix}
Temperature\\
WindSpeed\\
Humidity\\
VehicleSpeed\\
Load
\end{bmatrix}
$$

The first layer performs:

$$
Z_1=W_1X+B_1
$$

Then:

$$
A_1=ReLU(Z_1)
$$

The next layer performs:

$$
Z_2=W_2A_1+B_2
$$

Finally:

$$
Y=W_3A_2+B_3
$$

The resulting output represents the simulated predicted battery range.

The dashboard shows the network visually:

```text
Temperature ─────┐
Wind Speed ──────┤
Humidity ────────┤
Speed ───────────┤──► Hidden Layer ──► Hidden Layer ──► Range
Load ────────────┘
```

The network paths are visually animated whenever the telemetry changes.

---

# 6.6 Module 4 — Autoencoder Cybersecurity Guard

The Autoencoder receives a combined system-state vector.

For example:

$$
X=[
CNN_{confidence},
LSTM_{trajectory},
ANN_{range},
Temperature,
Wind,
Speed
]
$$

The vector passes through:

```text
Input Vector
     ↓
Encoder
     ↓
Latent Space
     ↓
Decoder
     ↓
Reconstructed Vector
```

The system calculates:

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(X_i-\hat{X_i})^2
$$

The calculated MSE is compared with a predefined threshold.

```text
MSE < Threshold
       ↓
Normal
       ↓
GREEN

MSE > Threshold
       ↓
Anomaly
       ↓
RED ALERT
```

---

# 6.7 Cyber Attack Simulation

The system includes an **Inject Cyber Attack / Malfunction** control.

During normal operation:

```text
Normal Input
     ↓
Autoencoder
     ↓
Small Reconstruction Error
     ↓
System SAFE
```

After attack injection:

```text
Normal Input
     ↓
Artificial Noise / Corruption
     ↓
Abnormal Input Vector
     ↓
Autoencoder
     ↓
Large Reconstruction Error
     ↓
Threshold Breached
     ↓
CRITICAL ALERT
```

This feature demonstrates the fundamental concept of reconstruction-based anomaly detection.

It does **not** represent an actual cybersecurity penetration test against a vehicle.

---

# 6.8 Backend Algorithm Visualizer

The second application page provides an educational visualization of the complete computational pipeline.

```text
Open-Meteo JSON
       ↓
Data Parser
       ↓
Numerical Feature Vector
       ↓
 ┌─────┼─────────────┐
 ↓     ↓             ↓
CNN   LSTM          ANN
 ↓     ↓             ↓
 └─────┼─────────────┘
       ↓
System State Vector
       ↓
Autoencoder
       ↓
MSE
       ↓
Safety Decision
```

The visualizer also presents the equations associated with each architecture.

---

# 7. TECHNOLOGICAL STACK

## 7.1 Frontend

### HTML5

HTML5 is used to create the structural components of the dashboard.

Major elements include:

* Navigation tabs
* Dashboard cards
* Canvas elements
* Buttons
* Select controls
* Mathematical panels
* Status indicators

---

## 7.2 CSS3

CSS3 provides the futuristic automotive interface.

The design includes:

* CSS Grid
* Flexbox
* Responsive layouts
* Dark theme
* Neon effects
* Glowing borders
* Animated backgrounds
* Scanline effects
* Dashboard cards
* Responsive visualizations

The visual style is inspired by modern vehicle cockpit and cyber-security monitoring interfaces.

---

## 7.3 JavaScript

Vanilla JavaScript forms the core application logic.

It manages:

* API communication
* Telemetry parsing
* Dashboard state
* Neural-network calculations
* Canvas rendering
* Chart updates
* User controls
* Attack injection
* MSE calculation
* UI state transitions

No separate backend server is required for the primary prototype.

---

## 7.4 Open-Meteo API

The application uses Open-Meteo as the external environmental telemetry source.

Advantages include:

* No API key for the intended public use
* Browser-accessible endpoint
* Weather information
* Current environmental parameters
* Geographical query support

The application converts the returned JSON into numerical values.

---

## 7.5 Chart.js

Chart.js is used for interactive graphical representation.

It is used for visualizing:

* CNN classification confidence
* Reconstruction error
* Time-series telemetry
* Dynamic numerical changes

---

## 7.6 HTML5 Canvas

Canvas is used for custom visualizations such as:

* Vehicle trajectory
* Radar/grid representation
* Simulated road scene
* Feature maps
* Prediction paths

---

## 7.7 Deployment

The application is deployed as a web application using Vercel.

The deployed prototype is:

[https://autonomous-vehicle-telematics-cabin.vercel.app/](https://autonomous-vehicle-telematics-cabin.vercel.app/?utm_source=chatgpt.com)

---

# 8. METHODOLOGY

## 8.1 Step 1 — Location Selection

The user first selects a Karnataka location.

Available locations:

```text
Bengaluru
Mysuru
Hubballi-Dharwad
Mangaluru
Belagavi
Kalaburagi
```

Each location has associated latitude and longitude coordinates.

---

## 8.2 Step 2 — Live Telemetry Acquisition

JavaScript creates a request to the Open-Meteo service.

Conceptually:

```text
Location
 ↓
Latitude / Longitude
 ↓
API URL
 ↓
HTTP Fetch
 ↓
JSON Response
```

The JSON response is parsed and required fields are extracted.

---

## 8.3 Step 3 — Environmental Feature Processing

The raw environmental values are transformed into numerical features.

For example:

```text
Temperature → Temperature Feature
Wind Speed → Wind Resistance Feature
Humidity → Environmental Load
Weather Code → Weather Condition
```

These values become inputs for the vehicle simulation.

---

# 8.4 Step 4 — Road Friction Estimation

The application can derive a simulated friction coefficient from environmental conditions.

A conceptual model is:

```text
Clear Weather
      ↓
Higher Friction

Rain / Poor Weather
      ↓
Reduced Friction
```

This is a simulation parameter rather than a physically calibrated tire-road friction model.

The distinction is important because actual road friction depends on many variables including:

* Tire condition
* Road material
* Water depth
* Tire pressure
* Vehicle speed
* Surface contamination
* Temperature

---

# 8.5 Step 5 — CNN Perception Simulation

The perception module creates a visual representation of road conditions.

A simplified convolution operation uses:

$$
FeatureMap=\sum Pixel\times Kernel
$$

A feature-map grid is updated dynamically.

The classification stage then produces confidence values.

Example:

```text
Clear Lane       0.82
Obstacle Ahead   0.11
Slow Down Sign   0.07
```

The values are visualized using a horizontal bar chart.

---

# 8.6 Step 6 — Softmax Calculation

For classification logits:

$$
z=[z_1,z_2,z_3]
$$

Softmax calculates:

$$
P_i=\frac{e^{z_i}}{\sum e^{z_j}}
$$

The probabilities sum approximately to:

$$
\sum_i P_i=1
$$

The dashboard represents these values as classification confidence.

---

# 8.7 Step 7 — LSTM Trajectory Processing

The system maintains a history of coordinates.

For example:

```text
T1 → (10, 20)
T2 → (11, 21)
T3 → (12, 22)
T4 → (13, 23)
T5 → (14, 24)
```

This sequence is visualized on a coordinate canvas.

The predicted trajectory is then extended beyond the current vehicle position.

The educational objective is to demonstrate how sequential models use previous states to estimate future states.

---

# 8.8 Step 8 — ANN Battery Estimation

The ANN combines environmental and vehicle parameters.

Example:

$$
X=[T,W,H,S,L]
$$

where:

* \(T\) = temperature
* \(W\) = wind speed
* \(H\) = humidity
* \(S\) = cruising speed
* \(L\) = simulated load

The feed-forward process is:

$$
Z_1=W_1X+B_1
$$

$$
A_1=ReLU(Z_1)
$$

$$
Z_2=W_2A_1+B_2
$$

$$
A_2=ReLU(Z_2)
$$

$$
Y=W_3A_2+B_3
$$

The output \(Y\) represents the estimated remaining range.

---

# 8.9 Step 9 — Autoencoder Processing

The system combines important outputs into a system-state vector.

Example:

$$
X=[C,T,R,S,W]
$$

where the values represent selected CNN, trajectory, range and telemetry states.

The encoder compresses the representation:

$$
Z=f_{encoder}(X)
$$

The decoder reconstructs:

$$
\hat{X}=f_{decoder}(Z)
$$

The reconstruction error is then calculated.

---

# 8.10 Step 10 — MSE Calculation

For:

$$
X=[x_1,x_2,...,x_n]
$$

and:

$$
\hat{X}=[\hat{x_1},\hat{x_2},...,\hat{x_n}]
$$

the error is:

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(x_i-\hat{x_i})^2
$$

Example:

```text
Original:
[0.80, 0.60, 0.72]

Reconstructed:
[0.78, 0.62, 0.70]
```

Then:

$$
MSE=
\frac{
(0.80-0.78)^2+
(0.60-0.62)^2+
(0.72-0.70)^2
}{3}
$$

The resulting value is displayed in the security module.

---

# 8.11 Step 11 — Attack Injection

When the user activates:

**INJECT CYBER ATTACK**

the system introduces abnormal noise into the state vector.

Conceptually:

$$
X'=X+N
$$

where \(N\) is an artificial noise vector.

The new vector produces a larger reconstruction error.

```text
Before Attack
MSE = Low
Status = SAFE

After Attack
MSE = High
Status = CRITICAL
```

The dashboard changes its visual state accordingly.

---

# 8.12 Step 12 — Safety Decision

The final decision is based on the reconstruction threshold.

```text
IF MSE ≤ Threshold
       ↓
SYSTEM NORMAL
       ↓
GREEN

IF MSE > Threshold
       ↓
SYSTEM ANOMALY
       ↓
RED
```

This provides an intuitive demonstration of anomaly detection.

---

# 9. OUTPUTS

## 9.1 Live Operations Dashboard

The main output is a futuristic autonomous vehicle dashboard.

It contains:

* Vehicle telemetry
* Environmental conditions
* Location information
* Perception panel
* Trajectory panel
* Battery estimation panel
* Cybersecurity panel

---

## 9.2 Live Environmental Telemetry

The application displays live environmental values obtained through the public weather service.

Typical parameters include:

| Parameter    | Purpose                           |
| ------------ | --------------------------------- |
| Temperature  | Environmental operating condition |
| Humidity     | Environmental load                |
| Wind Speed   | Wind resistance estimation        |
| Weather Code | Weather-condition classification  |
| Location     | Geographic context                |

---

# 9.3 CNN Feature Map

The CNN section displays an activation grid.

Conceptually:

```text
┌───┬───┬───┬───┬───┐
│ ░ │ █ │ ▓ │ ░ │ █ │
├───┼───┼───┼───┼───┤
│ ▓ │ █ │ ░ │ █ │ ▓ │
├───┼───┼───┼───┼───┤
│ █ │ ░ │ ▓ │ █ │ ░ │
├───┼───┼───┼───┼───┤
│ ░ │ ▓ │ █ │ ░ │ █ │
└───┴───┴───┴───┴───┘
```

This represents activation intensity rather than an actual camera sensor feature map.

---

# 9.4 CNN Classification Chart

The classification confidence is represented graphically.

Example:

```text
Clear Lane       ██████████████████
Obstacle Ahead   ███
Slow Down Sign   ██
```

This makes it easier to understand Softmax-based classification.

---

# 9.5 Trajectory Prediction

The trajectory panel shows:

```text
Past Path
   ────────●
            \
             \
              ● Current
               \
                \ . . . . Predicted Path
```

The solid line represents historical movement while the projected dotted line represents predicted future movement.

---

# 9.6 ANN Network Visualization

The ANN module presents the neural-network structure.

```text
INPUT              HIDDEN             OUTPUT

Temp ──────●
           │\
Wind ──────●─●──────●
           │/ \      │
Humidity ──●   ●─────●────► Range
              /      │
Speed ───────●───────●
                    │
Load ───────────────●
```

The network visualization helps students understand how information flows between layers.

---

# 9.7 Battery Range Output

The ANN generates a simulated remaining-range value.

For example:

```text
PREDICTED REMAINING RANGE

        287 km
```

The value changes according to the input parameters.

A higher simulated load or cruising speed can affect the calculated result according to the mathematical model.

---

# 9.8 Autoencoder Security Monitor

The security panel displays:

```text
SYSTEM INTEGRITY
────────────────────
NORMAL

Reconstruction Error
0.00XX
```

During abnormal conditions:

```text
SYSTEM INTEGRITY
────────────────────
CRITICAL

RECONSTRUCTION ERROR
████████████████████

INTRUSION DETECTED
```

---

# 9.9 Reconstruction Error Chart

The Chart.js line graph shows reconstruction error over time.

Normal operation:

```text
MSE
│
│     •  • •   •
│  • •       •   •
│ •
└────────────────── Time
```

Attack condition:

```text
MSE
│
│                 ●
│                 │
│                 │
│ • • • • • • • • │
└────────────────── Time
                  Attack
```

The spike provides an immediate visual indication of abnormal behavior.

---

# 9.10 Deep Learning Backend Simulator

The second page provides mathematical explanations.

The user can observe:

### CNN

$$
FeatureMap=\sum(Pixel\times Kernel)
$$

### LSTM

$$
f_t=\sigma(W_f[h_{t-1},x_t]+b_f)
$$

### ANN

$$
Y=W X+B
$$

followed by:

$$
ReLU(x)=max(0,x)
$$

### Autoencoder

$$
MSE=\frac{1}{n}\sum(X-\hat X)^2
$$

This makes the project more useful as an educational Deep Learning demonstration.

---

# 9.11 Interactive Controls

The system provides controls such as:

### Start

Starts the telemetry and visualization updates.

### Pause

Stops or pauses dynamic updates.

### Cruising Speed

Allows the user to modify the simulated vehicle speed.

### Location

Allows selection between Karnataka locations.

### Inject Cyber Attack

Introduces artificial abnormality into the system state.

These controls make the project interactive rather than a static visualization.

---

# 9.12 Expected System Behavior

| Condition                 | CNN                     | LSTM                           | ANN                     | Autoencoder    |
| ------------------------- | ----------------------- | ------------------------------ | ----------------------- | -------------- |
| Normal                    | Normal confidence       | Stable trajectory              | Normal range            | Low MSE        |
| High wind                 | Changed environment     | Potential trajectory variation | Range variation         | Monitoring     |
| High load                 | —                       | —                              | Reduced simulated range | Monitoring     |
| Cyber attack              | Possible abnormal input | Possible abnormal input        | Possible abnormal input | High MSE       |
| Attack threshold exceeded | —                       | —                              | —                       | Critical alert |

---

# 10. CONCLUSION

The **Autonomous Vehicle Telematics & Cabin Safety System** demonstrates how multiple Deep Learning concepts can be integrated into a single intelligent vehicle simulation.

The project combines four important architectures:

1. **CNN** — for visual perception concepts.
2. **RNN/LSTM** — for sequential trajectory prediction.
3. **Deep ANN** — for numerical vehicle-performance estimation.
4. **Autoencoder** — for anomaly and cybersecurity monitoring.

The system obtains real environmental telemetry from an open public data source and converts it into inputs for the simulated vehicle environment. This provides a more dynamic experience than a completely static dataset.

The CNN module demonstrates the mathematical principle of convolution and classification. The LSTM module demonstrates sequential processing and temporal memory. The ANN module demonstrates feed-forward matrix calculations using weights, biases and ReLU activation. The Autoencoder module demonstrates how reconstruction error can be used as an indicator of abnormal system behavior.

One of the key interactive features is the **Cyber Attack / Malfunction Injection** mechanism. By deliberately introducing abnormal noise into the system-state vector, the project demonstrates how reconstruction error can increase and cross a predefined threshold. The resulting change from a normal system state to a critical security state provides a clear visualization of anomaly detection.

The second page, the **Deep Learning Backend Simulator**, improves the educational value of the project by exposing the mathematical operations behind the dashboard rather than hiding them inside application logic.

Overall, the project provides an integrated educational representation of a connected autonomous vehicle ecosystem while demonstrating practical applications of fundamental Deep Learning architectures.

The prototype can be accessed at:

[Autonomous Vehicle Telematics & Cabin Safety System — Live Prototype] :- https://autonomous-vehicle-telematics-cabin.vercel.app/
